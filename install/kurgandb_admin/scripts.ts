


export const exampleGroup = {
  async exampleScript() { return "1"; },
  async exampleScript2() { return "2"; },
  deeperGroup: {
    async script() {
      // another comment
    }
  }
}

export async function exampleScript(argument1: string, argument2: string) {
  // You can add a descrition with the comment

  return `Hello world! ${argument1} ${argument2}`;
}