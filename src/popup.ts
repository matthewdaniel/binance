import * as moment from 'moment';
import * as $ from 'jquery';
import * as uuid from 'uuid/v1';
import { fetch, persist, apemail, addEmail, deleteEmail, tagEmailLink, getEmail, flagConfirmed } from './helpers';
import { iMail } from './interfaces';

let count = 0;

let init = async() => {
  count++;

  $('#counter').html(count.toString());

  let emails = (await fetch('email-addresses')) as iMail[] || [];
  
  $('#emails-list').html('');

    emails.forEach(email => {
      const li = $(`<li style="display: flex; width: 100%" id="email-${email.address.split('@')[0]}" data-id="${email.address.split('@')[0]}">
        <span><i class="delete-email fa fa-trash" style="cursor: pointer; color: darkred" /></span>
        <span>${email.address.split('@')[0]}</span>
        ${!email.confirmed && email.confirmLink ? `<span><button class="btn btn-sm btn-outline-primary confirm-btn">Confirm</botton></span>` : ''}
        ${email.confirmed ? `<span><button class="login-btn btn btn-sm btn-outline-primary">Login</botton></span>` : ''}
        
      </li>`)
  
      $('#emails-list').append(li)
    })
}


$(async _ => {
  init();  


  $(document).on('click', '.delete-email', ({ target }) => {
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

          chrome.tabs.create({active: true, selected: true, url: 'https://www.binance.com/userCenter/depositWithdraw.html'});
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
      
    
  let pat = new RegExp('a href=\"(.+?)\"')
  
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
      $('#reload').addClass('reloading');

      let emails = (await fetch('email-addresses')) as iMail[] || [];

      let promises = emails.map(async email => {
      
          if (email.confirmLink) return;

          await $.get(apemail('set_email_user', { email_user: email.address } )).promise();
              
          let res = await $.get(apemail('get_email_list', {offset: 0}), {dataType: "json"})
  
          res.list.map(async x => {
            let mail = await $.get(apemail('fetch_email', {email_id: x.mail_id})).promise();

            if (mail.mail_body.toLowerCase().indexOf('binance') == -1) return; // not the mail we're looking for
    
            let matches = mail.mail_body.match(pat);;

            if (matches.length < 2) return;

            tagEmailLink(email.address, matches[1]);
          });
      })

      await Promise.all(promises);

      await init();

      $('#reload').removeClass('reloading');
    })
});
