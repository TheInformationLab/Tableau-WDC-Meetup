// jQuery
import 'jquery';
// PopperJS
import 'popper.js';
// Bootstrap 4
import 'bootstrap';
// Material Design Bootstrap
import '../vendors/mdb/js/mdb';

const { tableau } = window;
const { schema } = window;
const { async } = window;

let authUrl = 'https://secure.meetup.com/oauth2/authorize?response_type=code&client_id=66u7tjs9tk09btdigogsrb7e0g&redirect_uri=https://meetup-wdc.theinformationlab.io';
let serverBase = '';
let proxyBase = '';

if (window.location.host !== 'meetup-wdc.theinformationlab.io') {
  authUrl = 'https://secure.meetup.com/oauth2/authorize?response_type=code&client_id=8horkk4k8232vvvcnaaus9mmi7&redirect_uri=http://localhost:8000';
  serverBase = 'http://localhost:3001';
  proxyBase = 'http://localhost:3002';
}

const muBase = 'https://api.meetup.com';

// const nextLinkRe = /<([A-Z0-9\D]+)>;.rel="next"/i;

// **
// START Utility functions
// **

// Function getQueryParams
//  - Parses URL parameters into a JSON Object
// @qs  {string}    The URL query string, usually from document.location.search
function getParameterByName(name) {
  const url = window.location.href;
  const testName = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${testName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function convertDateTime
//  - Parses epoch returned from API to one for Tableau
// @dt  {string}    The datetime to convert
function convertDate(dt) {
  const date = new Date(dt);
  const tabDate = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  return tabDate;
}

function convertDateTime(dt) {
  const date = new Date(dt);
  const tabDate = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
  return tabDate;
}

// Function getTokens
//  - Gets access and refresh tokens for the logged in user
// @code        {string}  authorisation code from OAuth2 redirect
// @callback    {function}  callback function returning the credentials
function getTokens(code, callback) {
  const settings = {
    url: `${serverBase}/api/auth?code=${code}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  $.ajax(settings).done((response) => {
    const creds = JSON.parse(response);
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (creds.expires_in - 600));
    creds.expires = expires;
    callback(JSON.stringify(creds));
  });
}

function refreshTokens(callback) {
  const creds = JSON.parse(tableau.password);
  const settings = {
    url: `${serverBase}/api/refresh?token=${creds.refresh_token}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  $.ajax(settings).done((response) => {
    const newCreds = JSON.parse(response);
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (creds.expires_in - 600));
    newCreds.expires = expires;
    callback(JSON.stringify(newCreds));
  });
}

function tokensHaveExpired() {
  const creds = JSON.parse(tableau.password);
  const now = new Date();
  const expires = new Date(creds.expires);
  return now > expires;
}

function tokensValid(callback) {
  const creds = JSON.parse(tableau.password);
  const url = `${muBase}/status`;
  const settings = {
    url: `${proxyBase}/proxy`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${creds.access_token}`,
      'Target-URL': url,
    },
  };
  $.ajax(settings).done((response) => {
    if (response && response.status === 'ok') {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function checkTokens(callback) {
  if (tokensHaveExpired()) {
    refreshTokens((newCreds) => {
      console.log(newCreds);
      tableau.password = newCreds;
      callback();
    });
  } else {
    tokensValid((result) => {
      if (result) {
        callback();
      } else {
        refreshTokens((newCreds) => {
          tableau.password = JSON.stringify(newCreds);
          callback();
        });
      }
    });
  }
}

// Function getMember
//  - Gets current memeber details & tests access token
// @callback    {function}  callback function returning the member object
function getMember(callback) {
  checkTokens(() => {
    const creds = JSON.parse(tableau.password);
    const url = `${muBase}/2/member/self`;
    const settings = {
      url: `${proxyBase}/proxy`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${creds.access_token}`,
        'Target-URL': url,
      },
    };
    $.ajax(settings).done((response) => {
      callback(response);
    });
  });
}

// Function getCurrentUserGroups
//  - Lists the authenticated member's groups in the order of leadership,
//    next upcoming event, then alphabetical order by name
// @callback    {callback}  callback function returning the current user groups
// @nextUrl     {string}    url of next page
// @Groups      {[group]}   array of groups from previous pages
function getCurrentUserGroups(callback, nextUrl, groups) {
  checkTokens(() => {
    let url = `${muBase}/self/groups`;
    const creds = JSON.parse(tableau.password);
    if (nextUrl) {
      url = nextUrl;
    }
    let data = [];
    if (groups) {
      data = groups;
    }
    const settings = {
      url: `${proxyBase}/proxy`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${creds.access_token}`,
        'Target-URL': url,
      },
    };
    $.ajax(settings)
      .done((response) => {
        data = data.concat(response);
      })
      .fail((err) => {
        console.log(err);
      })
      .always((body, status, xhr) => {
        const linkArr = xhr.getResponseHeader('link');
        if (linkArr) {
          let linkUrl = linkArr.split(',')[0];
          if (linkUrl && linkUrl.indexOf('rel="next"') > -1) {
            linkUrl = linkUrl.replace('>; rel="next"', '');
            linkUrl = linkUrl.slice(1);
            getCurrentUserGroups(callback, linkUrl, data);
          } else {
            callback(data);
          }
        } else {
          callback(data);
        }
      });
  });
}

// Function getGroupEvents
//  - Gets events from groups
// @groupUrl    {string}    urlname of group
// @withPast    {boolean}   get events that have ended?
// @callback    {callback}  callback function returning the current user events
// @nextUrl     {string}    url of next page
// @Groups      {[group]}   array of groups from previous pages
function getGroupEvents(groupUrl, withPast, callback, nextUrl, events) {
  checkTokens(() => {
    let url = `${muBase}/${groupUrl}/events`;
    if (nextUrl) {
      url = nextUrl;
    }
    const creds = JSON.parse(tableau.password);
    let data = [];
    if (events) {
      data = events;
    }
    let params = '';
    if (withPast) {
      params = '?status=past,upcoming';
    }
    const settings = {
      url: `${proxyBase}/proxy${params}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${creds.access_token}`,
        'Target-URL': url,
      },
    };
    $.ajax(settings)
      .done((response) => {
        data = data.concat(response);
      })
      .fail((err) => {
        console.log(err);
      })
      .always((body, status, xhr) => {
        const linkArr = xhr.getResponseHeader('link');
        if (linkArr) {
          let linkUrl = linkArr.split(',')[0];
          if (linkUrl && linkUrl.indexOf('rel="next"') > -1) {
            linkUrl = linkUrl.replace('>; rel="next"', '');
            linkUrl = linkUrl.slice(1);
            getGroupEvents(groupUrl, callback, linkUrl, data);
          } else {
            callback(data);
          }
        } else {
          callback(data);
        }
      });
  });
}

// Function getGroupMembers
//  - Gets members from groups
// @groupUrl    {string}    urlname of group
// @callback    {callback}  callback function returning the current user events
// @nextUrl     {string}    url of next page
// @Groups      {[group]}   array of groups from previous pages
function getGroupMembers(groupUrl, callback, nextUrl, members) {
  checkTokens(() => {
    let url = `${muBase}/${groupUrl}/members`;
    if (nextUrl) {
      url = nextUrl;
    }
    const creds = JSON.parse(tableau.password);
    let data = [];
    if (members) {
      data = members;
    }
    const settings = {
      url: `${proxyBase}/proxy`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${creds.access_token}`,
        'Target-URL': url,
      },
    };
    $.ajax(settings)
      .done((response) => {
        data = data.concat(response);
      })
      .fail((err) => {
        console.log(err);
      })
      .always((body, status, xhr) => {
        const linkArr = xhr.getResponseHeader('link');
        if (linkArr) {
          let linkUrl = linkArr.split(',')[0];
          if (linkUrl && linkUrl.indexOf('rel="next"') > -1) {
            linkUrl = linkUrl.replace('>; rel="next"', '');
            linkUrl = linkUrl.slice(1);
            getGroupMembers(groupUrl, callback, linkUrl, data);
          } else {
            callback(data);
          }
        } else {
          callback(data);
        }
      });
  });
}

// Function getGroupVenues
//  - Gets venues associated with groups
// @groupUrl    {string}    urlname of group
// @callback    {callback}  callback function returning the current user events
// @nextUrl     {string}    url of next page
// @Venues      {[venue]}   array of venues from previous pages
function getGroupVenues(groupUrl, callback, nextUrl, venues) {
  checkTokens(() => {
    let url = `${muBase}/${groupUrl}/venues`;
    if (nextUrl) {
      url = nextUrl;
    }
    const creds = JSON.parse(tableau.password);
    let data = [];
    if (venues) {
      data = venues;
    }
    const settings = {
      url: `${proxyBase}/proxy`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${creds.access_token}`,
        'Target-URL': url,
      },
    };
    $.ajax(settings)
      .done((response) => {
        data = data.concat(response);
      })
      .fail((err) => {
        console.log(err);
      })
      .always((body, status, xhr) => {
        const linkArr = xhr.getResponseHeader('link');
        if (linkArr) {
          let linkUrl = linkArr.split(',')[0];
          if (linkUrl && linkUrl.indexOf('rel="next"') > -1) {
            linkUrl = linkUrl.replace('>; rel="next"', '');
            linkUrl = linkUrl.slice(1);
            getGroupMembers(groupUrl, callback, linkUrl, data);
          } else {
            callback(data);
          }
        } else {
          callback(data);
        }
      });
  });
}

// **
// END Utility functions
// **

// **
// START Tableau WDC Code
// **

const muConnector = tableau.makeConnector();

muConnector.init = (initCallback) => {
  tableau.authType = tableau.authTypeEnum.custom;
  tableau.connectionName = 'Meetup';

  const code = getParameterByName('code');
  let hasAuth = false;
  hasAuth = tableau.password.length > 0;
  if (code) {
    // User has logged in. Saving token to password
    const authcode = code;
    getTokens(authcode, (tokens) => {
      if (tableau.phase === tableau.phaseEnum.interactivePhase
          || tableau.phase === tableau.phaseEnum.authPhase) {
        if (!hasAuth) {
          if (tableau.password === undefined || tableau.password === '') {
            tableau.password = tokens;
          }
          tableau.submit();
        } else {
          tableau.submit();
        }
      }
    });
  } else if (hasAuth) {
    tableau.submit();
  } else {
    const settings = {
      url: '/api/stats',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      processData: false,
      data: '{\n\t"wdc": "meetup",\n\t"action": "view"\n}',
    };
    $.ajax(settings)
      .done((response) => {
        console.log(response);
      })
      .always(() => {
        window.location.href = authUrl;
      });
  }
  initCallback();
};

// Define the schema

function getSchema(schemaCallback) {
  getMember(() => {
    schemaCallback(schema.tables, schema.joins);
  });
}

muConnector.getSchema = getSchema;

// Download the data

function getData(table, doneCallback) {
  const settings = {
    url: '/api/stats',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    processData: false,
    data: '{\n\t"wdc": "meetup",\n\t"action": "download"\n}',
  };
  $.ajax(settings)
    .done((response) => {
      console.log(response);
    })
    .always(() => {
      if (table.tableInfo.id === 'myGroups') {
        tableau.reportProgress('Getting my groups');
        getCurrentUserGroups((groups) => {
          for (let i = 0; i < groups.length; i += 1) {
            const group = groups[i];
            if (group.created) {
              group.created = convertDateTime(group.created);
            }
            if (group.key_photo && group.key_photo.highres_link) {
              group.photo_link = group.key_photo.highres_link;
            }
          }
          table.appendRows(groups);
          doneCallback();
        });
      } else if (table.tableInfo.id === 'groupEvents') {
        getCurrentUserGroups((groups) => {
          async.each(groups, (group, doneGroup) => {
            tableau.reportProgress(`Getting events for ${group.name}`);
            const groupUrl = group.urlname;
            getGroupEvents(groupUrl, true, (events) => {
              for (let i = 0; i < events.length; i += 1) {
                const event = events[i];
                if (event.created) {
                  event.created = convertDateTime(event.created);
                }
                if (event.group && event.group.id) {
                  event.group_id = event.group.id;
                }
                if (event.time) {
                  event.time = convertDateTime(event.time);
                }
                if (event.updated) {
                  event.updated = convertDateTime(event.updated);
                }
                if (event.venue && event.venue.id) {
                  event.venue_id = event.venue.id;
                }
              }
              table.appendRows(events);
              doneGroup();
            });
          }, (err) => {
            if (err) {
              console.log('There was an error with Group Events', err);
            } else {
              console.log('All done!');
              doneCallback();
            }
          });
        });
      } else if (table.tableInfo.id === 'groupMembers') {
        getCurrentUserGroups((groups) => {
          async.each(groups, (group, doneGroup) => {
            tableau.reportProgress(`Getting members of ${group.name}`);
            const groupUrl = group.urlname;
            getGroupMembers(groupUrl, (members) => {
              for (let i = 1; i < members.length; i += 1) {
                const member = members[i];
                if (member.joined) {
                  member.joined = convertDate(member.joined);
                }
                if (member.group_profile.created) {
                  member.joined_group = convertDate(member.group_profile.created);
                }
                if (member.group_profile.visited) {
                  member.last_visited = convertDate(member.group_profile.visited);
                }
                if (member.group_profile.group) {
                  member.group_id = member.group_profile.group.id;
                }
              }
              table.appendRows(members);
              doneGroup();
            });
          }, (err) => {
            if (err) {
              console.log('There was an error with Group Members', err);
            } else {
              console.log('All done!');
              doneCallback();
            }
          });
        });
      } else if (table.tableInfo.id === 'groupVenues') {
        getCurrentUserGroups((groups) => {
          async.each(groups, (group, doneGroup) => {
            tableau.reportProgress(`Getting venues for ${group.name}`);
            const groupUrl = group.urlname;
            getGroupVenues(groupUrl, (venues) => {
              table.appendRows(venues);
              doneGroup();
            });
          }, (err) => {
            if (err) {
              console.log('There was an error with Group Venues', err);
            } else {
              console.log('All done!');
              doneCallback();
            }
          });
        });
      }
    });
}
muConnector.getData = getData;

tableau.registerConnector(muConnector);

// **
// END Tableau WDC Code
// **

// Create event listeners for when the user submits the form
$(document).ready(() => {
  if ($('#splashText').position().top === 0) {
    $('#splashText').addClass('wdc');
  }
});
