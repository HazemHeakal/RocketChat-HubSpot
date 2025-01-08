"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubSpotIntegrationApp = void 0;
const App_1 = require("@rocket.chat/apps-engine/definition/App");
class HubSpotIntegrationApp extends App_1.App {
    constructor(info, logger, accessors) {
        super(info, logger, accessors);
        this.hubSpotApiUrl = 'https://api.hubapi.com';
        this.hubSpotApiToken = '';
        this.rocketChatToken = '';
        this.rocketChatUserId = '';
        this.appLogger = this.getLogger();
        this.customLogger({ message: 'App started' });
    }
    async executePostLivechatRoomStarted(room, read, http, persistence, modify) {
        var _a, _b, _c, _d;
        try {
            const visitor = room.visitor;
            const visitorEmail = (_b = (_a = visitor === null || visitor === void 0 ? void 0 : visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address;
            const visitorPhone = (_d = (_c = visitor.phone) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.phoneNumber;
            let token = visitor.token;
            await this.customLogger({ visitorEmail, visitorPhone, token });
            let contact = null;
            if (visitorEmail) {
                contact = await this.fetchHubSpotContact(visitorEmail, 'email', http, token);
            }
            if (!contact && visitorPhone) {
                contact = await this.fetchHubSpotContact(visitorPhone.startsWith("+") ? visitorPhone : "+" + visitorPhone, 'phone', http, token);
            }
            if (contact) {
                this.appLogger.debug(`Contact found in HubSpot: ${JSON.stringify(contact)}`);
            }
            else {
                const identifier = visitorEmail || visitorPhone || 'unknown contact';
                this.appLogger.debug(`No contact found in HubSpot for: ${identifier}`);
                await this.promptToAddContact(identifier, room, modify);
            }
        }
        catch (error) {
        }
    }
    async fetchHubSpotContact(value, property, http, token) {
        var _a, _b, _c;
        const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
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
        });
        const json = await response.json();
        if (response.ok && json.results.length > 0) {
            const hubspotResponse = json.results[0];
            const firstName = (_a = hubspotResponse === null || hubspotResponse === void 0 ? void 0 : hubspotResponse.properties) === null || _a === void 0 ? void 0 : _a.firstname;
            const lastName = (_b = hubspotResponse === null || hubspotResponse === void 0 ? void 0 : hubspotResponse.properties) === null || _b === void 0 ? void 0 : _b.lastname;
            const email = (_c = hubspotResponse === null || hubspotResponse === void 0 ? void 0 : hubspotResponse.properties) === null || _c === void 0 ? void 0 : _c.email;
            const name = `${firstName} ${lastName}`;
            await this.customLogger({ name, email, token });
            const res1 = await fetch(`https://home0001.rocket.chat/api/v1/omnichannel/contact`, {
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
            });
        }
        return null;
    }
    async promptToAddContact(identifier, room, modify) {
        const msgBuilder = modify.getNotifier().getMessageBuilder();
        msgBuilder.setRoom(room);
        msgBuilder.setText(`The contact with identifier *${identifier}* does not exist in HubSpot. Would you like to add it?`);
        await modify.getNotifier().notifyRoom(room, msgBuilder.getMessage());
    }
    async customLogger(data) {
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
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.HubSpotIntegrationApp = HubSpotIntegrationApp;
