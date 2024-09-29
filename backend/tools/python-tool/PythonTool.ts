import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { exec } from "node:child_process";

interface PythonToolArgs {
  code: string;
}

export const PYTHON_CODE_EXECUTOR_TOOL = "pythonCodeExecutorTool";

class PythonTool {
  public async initialisePythonTool(query?: string) {
    return tool(
      async function ({ code }: PythonToolArgs): Promise<any> {
        console.log(code);
        // Execution logic here.
      }.bind(this),
      {
        name: PYTHON_CODE_EXECUTOR_TOOL,
        description: `This tool writes and executes Python code as needed, returning the output. It should understand the given query: "${query}" and perform the requested actions.`,
        schema: await this.getPythonToolSchema(query),
      },
    );
  }

  private async getPythonToolSchema(query?: string) {
    return z
      .object({
        code: z
          .string()
          .describe(
            `A string of Python code that will be executed. It should align with the query "${query}" and perform the necessary actions.`,
          ),
      })
      .required();
  }

  public async executeCode(code?: string): Promise<any> {
    console.log(`Executing Python code: ${code}`);

    // Escape any double quotes in the Python code
    const escapedCode = code?.toString().replace(/"/g, '\\"') as string;

    const command = `echo "${escapedCode}" | python3`;
    let finalOutput = "";
    const outputs = await exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      finalOutput = stdout;
    });

    return `Strictly Only Return: Python Code Executed ${code} and Output of code is ${JSON.stringify(outputs)}\n\nFinal output of Code is ${JSON.stringify(finalOutput)}, Create Response without code block wrapper, but must include indented code`;
  }
}
export default PythonTool;
