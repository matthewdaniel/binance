import * as moment from 'moment';
import * as $ from 'jquery';
import * as uuid from 'uuid/v1';
import { fetch, listEmails, persist, apemail, addEmail, deleteEmail, tagEmailLink, getEmail, flagConfirmed } from './helpers';
import { iMail } from './interfaces';


let init = async () => {
  let emails = (await listEmails());

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

    chrome.cookies.getAll({ domain: '.binance.com' }, async cs => {
      var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
      await Promise.all(clearPs);

      persist('form-fill', {
        '#email': account + '@guerrillamail.com',
        '#pwd': 'Password123',
      });

      chrome.tabs.create({ active: true, selected: true, url: 'https://www.binance.com/userCenter/depositWithdraw.html' });
    })
  })


  $('#add-email').click(async () => {
    // const ePromise = await $.get(apemail('get_email_address')).promise();
    // $.get(apemail('forget_me'));

    let emailCount = (await listEmails()).length + 1;

    const email = emailCount.toString() + 'abc' + uuid().toString().substring(0, 20) + '@guerrillamail.com';

    // Log out existing user
    chrome.cookies.getAll({ domain: '.binance.com' }, async cs => {
      var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
      await Promise.all(clearPs);


      addEmail({ address: email })

      persist('form-fill', {
        '#email': email,
        '#regiterPassword': 'Password123',
        '#regiterRepeatPassword': 'Password123',
        '#agreement': 'checked',
      });

      chrome.tabs.create({ active: true, selected: true, url: 'https://www.binance.com/register.html' });
    })
  })
  //  let eRes = await ePromise;

  //  addEmail({address: eRes.email_addr})


  let pat = new RegExp('a href=\"(.+?)\"')

  $(document).on('click', '.confirm-btn', async ({ target }) => {
    let account = $(target).closest('li').data('id');

    let email = await getEmail(account);

    if (!email.confirmLink) return;

    chrome.cookies.getAll({ domain: '.binance.com' }, async cs => {
      var clearPs = cs.map(c => new Promise(resolve => chrome.cookies.remove({ "url": 'https://www.binance.com', "name": c.name }, resolve)));
      await Promise.all(clearPs);

      flagConfirmed(email.address);
      chrome.tabs.create({ active: true, selected: true, url: email.confirmLink });

    })


  });

  $('#emails-info').click(async () => {
    let emails = (await fetch('email-addresses')) as iMail[] || [];
    alert(JSON.stringify(emails, undefined, 4));
  })

  const reloadFn = async (force = false) => {
      $('#reload').addClass('reloading');
  
      let emails = (await listEmails()).filter(e => force || !e.confirmLink);
  
      let fetching = false;
  
      var process = (email) => !email || $.get(apemail('set_email_user', { email_user: email.address }))
        .then(x => $.get(apemail('get_email_list', { offset: 0 }), { dataType: "json" }))
        .then(async res => await Promise.all(res.list.map(x => $.get(apemail('fetch_email', { email_id: x.mail_id })))))
        .then(emails => {
          if (!emails || !emails.length || emails[0] == false) return;
  
          const mail = emails.filter(m => !!m).find((m: any) => m.mail_body.toLowerCase().indexOf('binance') != -1);
  
          let matches = (mail as any).mail_body.match(pat);;
  
          if (matches.length > 1)
            tagEmailLink(email.address, matches[1]);
        })
        .always(x => fetching = false);
  
  
      var interval = setInterval(_ => {
  
        if (!emails.length) {
          clearInterval(interval);
          init();
          $('#reload').removeClass('reloading');
        }
  
        if (fetching) return;
  
        process(emails.pop());
      }, 100);
    }
    reloadFn();
    $('#reload').click(x => reloadFn());
    $('#force-refresh').click(x => reloadFn(true));
});
