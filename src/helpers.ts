import { iMail } from './interfaces';

export const deleteEmail = async (addr) => {
    const current = (await fetch('email-addresses')) as iMail[] || [];

    return persist('email-addresses', current.filter(x => x.address.indexOf(addr) === -1));

}

export const flagConfirmed = async (address) => {
    let emails = await listEmails();

    emails = emails.map(e => {
        if (address != e.address) return e;

        return {
            address: e.address,
            confirmLink: e.confirmLink,
            confirmed: true,
        }
    })

    await persist('email-addresses', emails);
}
export const tagEmailLink = async (address, link) => {
    let emails = await listEmails();

    emails = emails.map(e => {
        if (address != e.address) return e;

        return {
            address: e.address,
            confirmLink: link
        }
    })

    await persist('email-addresses', emails);
}

export const addEmail = async (email: iMail) => {
    let emails = (await listEmails()) || []
    
    emails.push(email);

    await persist('email-addresses', emails);
}

export const listEmails = async (): Promise<iMail[]> => {
    return (await fetch('email-addresses', [])) as iMail[];
}

export const getEmail = async (account) => {
    let emails = await listEmails();

    return emails.find(x => x.address.indexOf(account) === 0);
}

export const persist = (key, value) => 
    chrome.storage.sync.set({
        [key]: JSON.stringify(value)
    })

export const fetch = (key, defaultVal: any = false) => new Promise(resolve => {
    chrome.storage.sync.get({[key]: JSON.stringify(defaultVal)}, 
        res => resolve(JSON.parse(res[key]))
    );

})

export const apemail = (fn, args: {[key: string]: string | number} = {}) => 
    `http://api.guerrillamail.com/ajax.php?site=guerrillamail.com&ip=127.0.0.1&agent=Mozilla_foo_bar&f=${fn}&`+Object.keys(args).map(k => `${k}=${args[k]}`).join('&');
    
