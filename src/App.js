import { MissionUtils } from "@woowacourse/mission-utils";
import { validateCarName, validateNumber } from "./validation.js";

class App {
  participant = [];
  count = [];

  async participate() {
    const carNameInput = await MissionUtils.Console.readLineAsync(
      "경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)"
    );

    const carList = carNameInput.split(",");

    for (let i = 0; i < carList.length; i++) {
      if (!validateCarName(carList[i]))
        throw new Error("[ERROR]: 자동차 이름은 5자 이하여야합니다.");
    }

    this.participant = carList;
    this.count = Array(this.participant.length).fill(0);
  }

  async getCycleCount() {
    const cycle = await MissionUtils.Console.readLineAsync(
      "시도할 횟수는 몇 회인가요?"
    );

    if (!validateNumber(cycle))
      throw new Error("[ERROR]: 시도 횟수는 숫자를 입력해야 합니다.");

    return cycle;
  }

  async forward() {
    const number = await MissionUtils.Random.pickNumberInRange(0, 9);

    if (parseInt(number) >= 4) return true;
    else return false;
  }

  async runOneCycle() {
    for (let j = 0; j < this.participant.length; j++) {
      if (await this.forward()) {
        this.count[j] += 1;
      }
      await MissionUtils.Console.print(
        `${this.participant[j]} : ${"-".repeat(this.count[j])}`
      );
    }
  }

  async depart(cycle) {
    for (let i = 0; i < cycle; i++) {
      await this.runOneCycle();
      MissionUtils.Console.print("\n");
    }
  }

  setWinner() {
    const max = Math.max(...this.count);
    const winner = [];

    for (let i = 0; i < this.participant.length; i++) {
      if (max === this.count[i]) winner.push(this.participant[i]);
    }

    MissionUtils.Console.print(`최종 우승자 : ${winner.join(", ")}`);
  }

  async play() {
    await this.participate();

    const cycle = await this.getCycleCount();

    await this.depart(cycle);

    this.setWinner();
  }
}

export default App;
