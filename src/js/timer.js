export class Timer {
    constructor(title, minutes, seconds) {
      this.title = title;
      this.minutes = minutes;
      this.seconds = seconds;
      this.isRunning = false;
      this.duration = 0;
      this.elapsed = 0;
      this.timer = null;
    }
  
    toggleTimer = () => (this.isRunning ? this.stopTimer() : this.startTimer());
  
    startTimer = () => {
      if (this.duration) {
        this.isRunning = true;
        const start = Date.now() - this.elapsed;
        this.timer = setInterval(() => {
          const now = Date.now();
          const diff = this.duration * 1000 - (now - start);
          if (diff <= 0) {
            this.stopTimer();
            return;
          }
          this.updateDisplay(diff);
          this.elapsed = now - start;
        }, 100);
      }
    };
  
    stopTimer = () => {
      clearInterval(this.timer);
      this.isRunning = false;
    };
  
    updateDisplay = (time) => {
      const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);
      this.minutes.textContent = `0${minutes}`.slice(-2);
      this.seconds.textContent = `0${seconds}`.slice(-2);
    };
  
    resetTimerSettings = () => {
      this.isRunning = false;
      this.elapsed = 0;
      this.updateDisplay(this.duration * 1000);
    };
  }