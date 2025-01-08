import {
    IAppAccessors,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IPostLivechatRoomStarted, ILivechatRoom, IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

interface Contact {
    id: string;
    [key: string]: any;
}

export class HubSpotIntegrationApp extends App implements IPostLivechatRoomStarted {
    private hubSpotApiUrl = 'https://api.hubapi.com';
    private hubSpotApiToken = '';
    private rocketChatToken = '';
    private rocketChatUserId = '';
    private readonly appLogger: ILogger;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger();
        this.customLogger({ message: 'App started' });
    }

    public async executePostLivechatRoomStarted(
        room: ILivechatRoom,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        try {
            const visitor = room.visitor as IVisitor;
            const visitorEmail = visitor?.visitorEmails?.[0]?.address;
            const visitorPhone = visitor.phone?.[0]?.phoneNumber;
            let token = visitor.token;
            // try {
            //     const res = await fetch(
            //         `https://home0001.rocket.chat/api/v1/omnichannel/contact.search?phone=${visitorPhone}`,
            //         {
            //             method: 'GET',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'X-Auth-Token': this.rocketChatToken,
            //                 'X-User-Id': this.rocketChatUserId,
            //             },
            //         }
            //     );

            //     const json = await res.json();

            //     token = json.contact.token;
            // } catch (error) {
            //     await this.customLogger({ "metadata": "get contact token from rocket chat", error: JSON.stringify(error) });
            // }

            await this.customLogger({ visitorEmail, visitorPhone, token });

            let contact: Contact | null = null;

            if (visitorEmail) {
                contact = await this.fetchHubSpotContact(visitorEmail, 'email', http, token);
            }

            if (!contact && visitorPhone) {
                contact = await this.fetchHubSpotContact(visitorPhone.startsWith("+") ? visitorPhone : "+" + visitorPhone, 'phone', http, token);
            }

            if (contact) {
                this.appLogger.debug(`Contact found in HubSpot: ${JSON.stringify(contact)}`);
            } else {
                const identifier = visitorEmail || visitorPhone || 'unknown contact';
                this.appLogger.debug(`No contact found in HubSpot for: ${identifier}`);
                await this.promptToAddContact(identifier, room, modify);
            }
        } catch (error) {
        }
    }

    private async fetchHubSpotContact(value: string, property: 'email' | 'phone', http: IHttp, token): Promise<Contact | null> {
        // const response = await http.post(`${this.hubSpotApiUrl}/crm/v3/objects/contacts/search`, {
        //     headers: {
        //         Authorization: `Bearer ${this.hubSpotApiToken}`,
        //         'Content-Type': 'application/json',
        //     },
        //     data: {
        //         filterGroups: [
        //             {
        //                 filters: [
        //                     {
        //                         propertyName: property,
        //                         operator: 'EQ',
        //                         value,
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // });

        const response = await fetch(
            "https://api.hubapi.com/crm/v3/objects/contacts/search",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.hubSpotApiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: property,
                                    operator: "EQ",
                                    value,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const json = await response.json();

        if (response.ok && json.results.length > 0) {
            const hubspotResponse = json.results[0];
            const firstName = hubspotResponse?.properties?.firstname;
            const lastName = hubspotResponse?.properties?.lastname;
            const email = hubspotResponse?.properties?.email;
            const name = `${firstName} ${lastName}`;
            await this.customLogger({ name, email, token });
            const res1 = await fetch(
                `https://home0001.rocket.chat/api/v1/omnichannel/contact`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': this.rocketChatToken,
                        'X-User-Id': this.rocketChatUserId,
                    },
                    body: JSON.stringify({
                        token,
                        name,
                        email,
                    }),
                }
            );
        }

        return null;
    }

    private async promptToAddContact(identifier: string, room: ILivechatRoom, modify: IModify): Promise<void> {
        const msgBuilder = modify.getNotifier().getMessageBuilder();
        msgBuilder.setRoom(room);
        msgBuilder.setText(
            `The contact with identifier *${identifier}* does not exist in HubSpot. Would you like to add it?`,
        );
        await modify.getNotifier().notifyRoom(room, msgBuilder.getMessage());
    }

    private async customLogger(data: any): Promise<void> {
        try {
            const response = await fetch('https://3922-173-34-88-48.ngrok-free.app/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
    }
}

