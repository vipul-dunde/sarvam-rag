import { z } from "zod";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { RunnableConfig } from "@langchain/core/runnables";
import { StructuredTool } from "@langchain/core/tools";

const schema = z.object({
    label: z.string().describe("A minimal (usually one or two words) label/name displayed when collecting input from the user."),
    description: z.string().describe("A more detailed description of the input being requested from the user."),
    required: z.boolean().default(true).describe("If the input is strictly required or not."),
    multiline: z.boolean().default(false).describe("If the input is expected to be large or requires multiple lines.")
}).required();

export const VECTOR_STORE_TOOL_NAME = "vector_store_tool";

export class VectorStoreTool extends StructuredTool {
    readonly name = VECTOR_STORE_TOOL_NAME;
    readonly description = "This Tool is used when user query is non-generic and we need to fetch data from Vector Store.";
    readonly schema = schema;

    async _call(
        _input: z.output<typeof schema>,
        _runManager?: CallbackManagerForToolRun,
        _parentConfig?: RunnableConfig,
    ): Promise<undefined> {
        // no need to return anything, this tool won't actually be invoked.
        return undefined;
    }
}
