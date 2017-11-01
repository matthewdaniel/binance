import * as moment from 'moment';
import * as $ from 'jquery';
import * as uuid from 'uuid/v1';
import { fetch, persist, apemail, addEmail, deleteEmail, tagEmailLink, getEmail, flagConfirmed } from './helpers';
import { iMail } from './interfaces';

let count = 0;

$(async _ => {
  let emails = (await fetch('email-addresses')) as iMail[] || [];

  emails.forEach(email => {
    const li = $(`<li style="display: flex; width: 100%; padding-right: 10" id="email-${email.address.split('@')[0]}" data-id="${email.address.split('@')[0]}">
      <span>${email.address.split('@')[0]}</span>
      ${!email.confirmed && email.confirmLink ? `<button class="confirm-btn">Confirm</botton>` : ''}
      ${email.confirmed ? `<button class="login-btn">Login</botton>` : ''}
      <button class="delete-email" >Forget</button>
    </li>`)

    $('#emails-list').append(li)
  })


  $('.delete-email').click(({ target }) => {
    
      const account = $(target).closest('li').data('id');

      deleteEmail(account);

      $(`#email-${account}`).remove();

  })
  // chrome.tabs.query(queryInfo, tabs => {
  //   $('#url').text(tabs[0].url);
  //   $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
  // });

  $(document).on('click', '.login-btn', async ({ target }) => {
    let account = $(target).closest('li').data('id');

    chrome.cookies.getAll({domain: '.binance.com'}, async cs => {
          var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({"url": 'https://www.binance.com', "name": c.name}, resolve)));
          await Promise.all(clearPs);

          persist('form-fill', {
            '#email': account+'@guerrillamail.com',
            '#pwd': 'Password123',
          });

          chrome.tabs.create({active: true, selected: true, url: 'https://www.binance.com/login.html'});
      })
  })

    $('#add-email').click(async () => {
      // const ePromise = await $.get(apemail('get_email_address')).promise();
      // $.get(apemail('forget_me'));

      const email = 'abc'+uuid().toString().substring(0, 20)+'@guerrillamail.com';

      // Log out existing user
      chrome.cookies.getAll({domain: '.binance.com'}, async cs => {
          var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({"url": 'https://www.binance.com', "name": c.name}, resolve)));
          await Promise.all(clearPs);
          

          addEmail({address: email})

          persist('form-fill', {
            '#email': email,
            '#regiterPassword': 'Password123',
            '#regiterRepeatPassword': 'Password123',
            '#agreement': 'checked',
          });

          chrome.tabs.create({active: true, selected: true, url: 'https://www.binance.com/register.html'});
      })
   })
  //  let eRes = await ePromise;

  //  addEmail({address: eRes.email_addr})
      
    
  let pat = new RegExp('a href=\"(.+?)\"', 'g')
  
    $(document).on('click', '.confirm-btn', async ({ target }) => {
      let account = $(target).closest('li').data('id');

      let email = await getEmail(account);

      if (!email.confirmLink) return;

      chrome.cookies.getAll({domain: '.binance.com'}, async cs => {
        var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({"url": 'https://www.binance.com', "name": c.name}, resolve)));
        await Promise.all(clearPs);

        flagConfirmed(email.address);
        chrome.tabs.create({active: true, selected: true, url: email.confirmLink});

    })
      

    });

    
    $('#reload').click(async () => {
      let emails = (await fetch('email-addresses')) as iMail[] || [];
      
      for (var email of emails) {
          // if (email.confirmLink) return;

          await $.get(apemail('set_email_user', { seq: 1, email_user: email.address.split('@')[0] } )).promise();
              
          let res = await $.get(apemail('get_email_list', {offset: 0}), {dataType: "json"})
  
          res.list.map(async x => {
            let mail = await $.get(apemail('fetch_email', {email_id: x.mail_id})).promise();

            if (mail.mail_body.toLowerCase().indexOf('binance') == -1) return; // not the mail we're looking for
    
            let matches = mail.mail_body.match(pat);;

            if (matches.length < 2) return;
    
            await $.get(matches[1]).promise()
            tagEmailLink(email.address, matches[1]);
          });
      }
      
    })
});
