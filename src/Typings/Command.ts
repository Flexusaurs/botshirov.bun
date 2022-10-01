import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../models/Client";











interface RunOptions{
    client: ExtendedClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any;


export type CommandType = {
    userPermission?: PermissionResolvable[];
    run: RunFunction;
    cooldown: number;
} & ChatInputApplicationCommandData