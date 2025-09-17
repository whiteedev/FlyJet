// src/components/CrashEngine.js

export const CrashEngineState = {
    Loading: "loading",
    Active: "active",
    Over: "over"
  };
  
  export class CrashEngine {
    static CrashSpeed = 0.00006;
    static PredictingLapse = 300;
  
    startTime = 0;
    elapsedTime = 0;
    finalElapsed = 0;
    finalMultiplier = 0;
    crashPoint = null;
    betAmount = 0;
    graphWidth = 0;
    graphHeight = 0;
    plotWidth = 0;
    plotHeight = 0;
    plotOffsetX = 0;
    plotOffsetY = 0;
    xAxis = 0;
    yAxis = 0;
    xIncrement = 0;
    yIncrement = 0;
    xAxisMinimum = 1000;
    yAxisMinimum = -1;
    elapsedOffset = 0;
    yAxisMultiplier = 1.5;
    multiplier = 1;
    tickTimeout = null;
    lag = false;
    lastGameTick = null;
    lagTimeout = null;
    state = CrashEngineState.Loading;
  
    constructor() {
      this.checkForLag = this.checkForLag.bind(this);
    }
  
    checkForLag() {
      this.lag = true;
    }
  
    onResize(width, height) {
      this.graphWidth = width;
      this.graphHeight = height;
      this.plotOffsetX = 50;
      this.plotOffsetY = 40;
      this.plotWidth = width - this.plotOffsetX;
      this.plotHeight = height - this.plotOffsetY;
    }
  
    getMultiplierElapsed(multiplier) {
      return (
        100 *
        Math.ceil(
          Math.log(multiplier) / Math.log(Math.E) / CrashEngine.CrashSpeed / 100
        )
      );
    }
  
    getElapsedPayout(elapsedTime) {
      const payout =
        ~~(100 * Math.pow(Math.E, CrashEngine.CrashSpeed * elapsedTime)) / 100;
      if (!isFinite(payout)) {
        throw new Error("Infinite payout");
      }
      return Math.max(payout, 1);
    }
  
    onGameTick(serverTick) {
      this.lastGameTick = Date.now();
      if (this.lag) {
        this.lag = false;
      }
      const lag = this.lastGameTick - serverTick;
      if (this.startTime > lag) {
        this.startTime = lag;
      }
      if (this.lagTimeout) {
        clearTimeout(this.lagTimeout);
      }
  
      this.lagTimeout = setTimeout(this.checkForLag, CrashEngine.PredictingLapse);
    }
  
    tick() {
      this.elapsedTime = this.getElapsedTime();
      this.multiplier =
        this.state !== CrashEngineState.Over
          ? this.getElapsedPayout(this.elapsedTime)
          : this.finalMultiplier;
      this.yAxisMinimum = this.yAxisMultiplier;
      this.xAxis = Math.max(
        this.elapsedTime + this.elapsedOffset,
        this.xAxisMinimum
      );
      this.yAxis = Math.max(this.multiplier, this.yAxisMinimum);
      this.xIncrement = this.plotWidth / this.xAxis;
      this.yIncrement = this.plotHeight / this.yAxis;
    }
  
    destroy() {
      if (this.tickTimeout) {
        clearTimeout(this.tickTimeout);
      }
  
      if (this.lagTimeout) {
        clearTimeout(this.lagTimeout);
      }
    }
  
    getElapsedTime() {
      if (this.state === CrashEngineState.Over) {
        return this.finalElapsed;
      }
  
      if (this.state !== CrashEngineState.Active) {
        return 0;
      }
  
      return Date.now() - this.startTime;
    }
  
    getElapsedPosition(elapsedTime) {
      const elapsedPayout = this.getElapsedPayout(elapsedTime) - 1;
      return {
        x: elapsedTime * this.xIncrement,
        y: this.plotHeight - elapsedPayout * this.yIncrement
      };
    }
  
    getYMultiplier(yPosition) {
      return (
        Math.ceil(
          1000 * (this.yAxis - (yPosition / this.plotHeight) * this.yAxis + 1)
        ) / 1000
      );
    }
  
    getMultiplierY(multiplier) {
      return this.plotHeight - (multiplier - 1) * this.yIncrement;
    }
  }
  