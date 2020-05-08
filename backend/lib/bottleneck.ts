import Bottleneck from "bottleneck";
import Moleculer from "moleculer";

class Singleton {
  static instance: Bottleneck.Group;
  private logger: Moleculer.LoggerInstance;

  constructor(logger: Moleculer.LoggerInstance) {
    if (!Singleton.instance) {
      this.logger = logger;

      Singleton.instance = new Bottleneck.Group({
        maxConcurrent: 10,
        minTime: 200,
        highWater: 1000,
      });

      Singleton.instance.on("created", (limiter, key) => {
        this.logger.info(`A new limiter was created for "${key}"`);

        limiter.on("error", (error) => {
          this.logger.error("Limiter received error", error);
        });
      });
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

export default Singleton;
