import { z } from "zod";
import { tool } from "@langchain/core/tools";

export const MATHEMATICS_TOOL = "mathematicsTool";

interface MathOperands {
  operands: number[]; // or whatever type operands should be
}

interface MathToolArgs extends MathOperands {
  operation: string; // Define the operation as a string, or use a union type for specific operations
}

class MathTool {
  public async initialiseMathTool() {
    const mathematicsTool = tool(
      async function ({
        operation,
        operands,
      }: MathToolArgs): Promise<any> {}.bind(this),
      {
        name: MATHEMATICS_TOOL,
        description:
          "A tool for performing basic and advanced mathematical operations.",
        schema: await this.getMathToolSchema(),
      },
    );
    return mathematicsTool;
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
