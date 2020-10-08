"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
class Utilities {
    static logs(msg, msg2 = '') {
        if (this.showLogs) {
            if (msg2)
                console.log(msg, msg2);
            else
                console.log(msg);
        }
    }
    static buildNodeURL(url) {
        try {
            const isValidURL = this.validateURL(url);
            return `${isValidURL.protocol}://${isValidURL.domainIp}:${isValidURL.port}`;
        }
        catch (error) {
            return error;
        }
    }
    static splitURL(url) {
        let port = '';
        const splitStr = url.split('://');
        const protocol = (splitStr.length > 1) ? splitStr[0] : 'http';
        const domainPort = (splitStr.length > 1) ? splitStr[1] : splitStr[0];
        const domainPortSplit = domainPort.split(':');
        const domainIp = domainPortSplit[0];
        if (domainPortSplit.length > 1)
            port = domainPortSplit[1];
        else
            port = (protocol === 'http') ? '3000' : '443';
        return { protocol, domainIp, port };
    }
    static validateURL(str) {
        const urlSplit = this.splitURL(str);
        const regexProtocol = new RegExp('^(https?)$');
        if (!regexProtocol.test(urlSplit.protocol))
            throw (`Invalid Protocol`);
        const expDomain = '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$';
        const regexpDomain = new RegExp(expDomain);
        const expIp = '((?!0)(?!.*\\.$)((1?\\d?\\d|25[0-5]|2[0-4]\\d)(\\.|$)){4})';
        const regexDomainIp = new RegExp(expIp);
        let isValidIp = regexDomainIp.test(urlSplit.domainIp);
        let isValidDomain = regexpDomain.test(urlSplit.domainIp);
        if (!isValidDomain && !isValidIp)
            throw (`Ip or invalid domain name`);
        const regexPort = new RegExp(`^(\\:(?!0)\\d{2,5}$)`);
        if (!regexPort.test(`:${urlSplit.port}`))
            throw (`Invalid port`);
        return urlSplit;
    }
}
exports.Utilities = Utilities;
Utilities.showLogs = true;
