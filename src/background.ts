
import { persist, fetch, apemail, listEmails,tagEmailLink } from './helpers'
import * as $ from 'jquery';
import { iMail } from './interfaces'

let fillForms = (formFill) => {
    Object.keys(formFill).map(k => {
        console.log(k);
        if (k.indexOf('#') !== -1) {
            var el = (document.getElementById(k.split('#')[1]) as any);

            if (formFill[k] == 'checked') {
                el.checked = true;
            } else {
                el.value = formFill[k];
            }
            
        } else if (k.indexOf('.') != -1) {

        } else {
            (document.getElementById(k) as any).value = formFill[k]
        }        
    });


}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status != 'complete') return;

    const formFill = await fetch('form-fill', {});

    chrome.tabs.executeScript({
        code: `(${fillForms.toString()})(${JSON.stringify(formFill)})`
    })

  })



let pat = new RegExp('a href=\"(.+?)\"')
setInterval(async () => { 
    // let emails = (await fetch('email-addresses')) as iMail[] || [];
    
    // for (var email of emails) {
    //     await $.get(apemail('set_email_user', { seq: 1, email_user: email.address.split('@')[0] } )).promise();
            
    //     let res = await $.get(apemail('get_email_list', {offset: 0}), {dataType: "json"})

    //     res.list.map(async x => {
    //     let mail = await $.get(apemail('fetch_email', {email_id: x.mail_id})).promise();

    //     if (!mail.mail_body.toLowerCase().indexOf('binance')) return; // not the mail we're looking for

    //     let matches = mail.mail_body.match(pat);;

    //     if (matches.length < 2) return;

    //     tagEmailLink(email.address, matches[1]);
    //     });
    // }

    // emails.forEach(async email => {
    //     // this might have a race condition if new mail is requested while we 
    //     // are updating this email stuff
    //     // alert('start');
    //     // let res = await $.get(`${apemail}&f=fetch_email&email_id=${email}`).promise();

    //     alert(JSON.stringify(res));
    // })
 }, 5000);

