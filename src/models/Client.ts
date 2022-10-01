import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection} from 'discord.js';
import { CommandType } from '../Typings/Command';
import { Glob, promise as GlobPromise } from 'glob-promise';
import { promisify } from 'util';
import { glob } from 'glob';
import { RegisterCommandsOptions } from '../Typings/ClientTyping';
import Event from './Event';

export class ExtendedClient extends Client {
    public commands: Collection<string, CommandType> = new Collection();


    constructor(){
        super({intents: 32767});
    }

    start(){
        console.log("Botshirov.bun_____initiating startup")
        this.registerModules();
        this.login(process.env.botToken);
    }

    async importFile(filePath: string){
      return(await import(filePath))?.default  
    }

    async registerCommands({commands, guildId}: RegisterCommandsOptions){
        if(guildId){
            this.guilds.cache.get(guildId)?.commands.set(commands)
            console.log(`registering commands to guild ${guildId}`)
        } else{
            this.application?.commands.set(commands)
            console.log("registering global commands")
        }
    }

    async registerModules(){
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await GlobPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
        console.log({ commandFiles });
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath)
            if(!command.name) return;

            this.commands.set(command.name, command)
            slashCommands.push(command)
        })

        const eventFiles = await GlobPromise(`${__dirname}/../events/*{.ts,.js}`)
        eventFiles.forEach(async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath)
            this.on(event.event, event.run)
        })
    }

    

}