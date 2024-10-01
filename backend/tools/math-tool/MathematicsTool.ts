import { z } from "zod";
import { tool } from "@langchain/core/tools";

export const MATHEMATICS_TOOL = "mathematicsTool";

interface MathOperands {
  operands: number[];
}

interface MathToolArgs extends MathOperands {
  operation: string;
}

class MathTool {
  public async initialiseMathTool() {
    return tool(
      async function ({ operation, operands }: MathToolArgs): Promise<any> {
        console.log(operation, operands);
      }.bind(this),
      {
        name: MATHEMATICS_TOOL,
        description:
          'A tool for performing basic and advanced mathematical operations. You should strictly take queries related to operations like "add", "subtract", "multiply", "divide", "sqrt", "power" and perform the requested actions.',
        schema: await this.getMathToolSchema(),
      },
    );
  }

  private async getMathToolSchema() {
    return z
      .object({
        operation: z
          .enum(["add", "subtract", "multiply", "divide", "sqrt", "power"])
          .describe("The mathematical operation to perform."),
        operands: z
          .array(z.number())
          .min(1)
          .describe("The numbers to use in the operation."),
      })
      .required();
  }

  public performOperation(operation: string, operands: number[]): number {
    switch (operation) {
      case "add":
        return operands.reduce((acc, curr) => acc + curr, 0);
      case "subtract":
        return operands.reduce((acc, curr) => acc - curr);
      case "multiply":
        return operands.reduce((acc, curr) => acc * curr, 1);
      case "divide":
        return operands.reduce((acc, curr) => {
          if (curr === 0) throw new Error("Cannot divide by zero");
          return acc / curr;
        });
      case "sqrt":
        if (operands.length !== 1) {
          throw new Error(
            "Square root operation requires exactly one operand.",
          );
        }
        return Math.sqrt(operands[0]);
      case "power":
        if (operands.length !== 2) {
          throw new Error("Power operation requires exactly two operands.");
        }
        return Math.pow(operands[0], operands[1]);
      default:
        throw new Error("Invalid operation");
    }
  }
}

export default MathTool;
