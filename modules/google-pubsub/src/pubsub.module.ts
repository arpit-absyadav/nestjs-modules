import {DynamicModule, Module, Provider} from '@nestjs/common';
import {GoogleAuthOptions} from './domain';
import {PubsubService} from './pubsub.service';
import {PubsubHelper} from './pubsub.helper';
import {ParsePubsubMessagePipe} from './parse-pubsub-message.pipe';

@Module({})
export class PubsubModule {
    public static forRoot (
        configFile: GoogleAuthOptions,
        cryptoSignKey: string,
        cryptoEncryptionKey: string,
        serviceIdentifier: string,
    ): DynamicModule {
        const providers: Provider[] = [
            ParsePubsubMessagePipe,
            PubsubHelper,
            {
                provide: PubsubService,
                useFactory: async (pubsubHelper: PubsubHelper): Promise<PubsubService> => PubsubService.create(
                    configFile,
                    cryptoEncryptionKey,
                    cryptoSignKey,
                    pubsubHelper,
                    serviceIdentifier,
                ),
                inject: [PubsubHelper],
            },
        ];

        return {
            module: PubsubModule,
            providers,
            exports: providers,
        };
    }
}
