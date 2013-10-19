#!/usr/bin/env node

/************************************************************************
 * Include the Stateless API
 ***********************************************************************/

var API = require('../index').Stateless;

/************************************************************************
 * Read the access token from the command line.
 ***********************************************************************/

if (process.argv.length < 3) {
    console.log("Usage: node scraper.js ACCESS_TOKEN");
    process.exit(1);
} 
var ACCESS_TOKEN = process.argv[2];

/************************************************************************
 * Request your user id and name
 ***********************************************************************/

API.Users.me(ACCESS_TOKEN, function(err,ret) {
  if (!err) {
    console.log("Your user id is", ret.id, "and your name is", ret.name);        
  } else {
    console.log("ERROR!", err)
  }
});

/************************************************************************
 * Request all your group info
 ***********************************************************************/

API.Groups.index(ACCESS_TOKEN, function(err,ret) {
  if (!err) {
    var names = [];
    for (var i = 0; i < ret.length; i++) {
      names.push({"name":ret[i].name, "id":ret[i].id});
    }
    console.log(names); 
    //console.log(ret);
  } else {
    console.log("ERROR!", err)
  }
});

/************************************************************************
 * If you also supply a group_id as a second argument, get group details
 ***********************************************************************/

// 
// 1701426
//

if (process.argv.length == 4) {
  MAX = 3;
  var group_id = process.argv[3];
  var page, opts;


  page = 0    // 1 page denotes 20 messages
  msg_no = 0
  opts = {}

  // Filter the messages user the user_id of a member to search up messages
  var filter_messages = function(opts, targets){ 
    API.Messages.index(ACCESS_TOKEN, group_id, opts, function(err,ret){
      if (!err) {
        //console.log("Group info is", ret);        
        // Do something with the messages here...
        for (var i=0; i < ret['messages'].length; i++){
          //console.log(msg_no, ret['messages'][i]['text']);
          for (var j=0; j < targets.length; j++){
            if (ret['messages'][i]['user_id'] == targets[j]){
              console.log(ret['messages'][i]['text']);
            }
          }
          msg_no++
        }        
        
        last_msg = ret['messages'].pop() // first element in array will be the latest message

        before_id = last_msg['id']
        opts = {before_id:before_id}; // everything before this id

        console.log("Running page ", page);
        page++;
        
        // base case
        if (page < MAX){
          check_message(opts)
        }
      } else {
        console.log("ERROR!", err)
      }
    });
  }



  // Get member names this way
  // Takes in GroupMe member names and returns the user ids in a JSON
  // mode: either "id" or "nickname" matching
  var get_members = function(targets, mode){
    payload = []
    API.Groups.show(ACCESS_TOKEN, group_id,function(err,ret) {
      if (!err) {
        //console.log("Group info is", ret);        
        //console.log(ret['creator_user_id'])
        //console.log(Object.keys(ret))
        for (var i=0; i < ret['members'].length; i++){
          for (var j=0; j < targets.length; j++){
            //console.log(ret['members'][i]['nickname'].toLowerCase())
            if (mode == "nickname"){
              if (ret['members'][i]['nickname'].toLowerCase() == targets[j].toLowerCase()){
                console.log(targets[j], "'s user ID is", ret['members'][i]['user_id'])

                mini_payload = {name:targets[j],user_id:ret['members'][i]['user_id']}
                payload.push(mini_payload)
              }
            } else if (mode == "id"){
              if (ret['members'][i]['user_id'] == targets[j]){
                console.log("Owner of ID: ", targets[j], "is", ret['members'][i]['nickname'])

                mini_payload = {user_id:targets[j],name:ret['members'][i]['nickname']}
                payload.push(mini_payload)
              }
            }
          }
        }
        console.log(payload);
        return payload;

      } else {
        console.log("ERROR!", err)
      }
    });
  }

  var sampleId = get_members(['curveball'], 'nickname')
  console.log(sampleId)
  //get_members([3662629], 'id') // who created the GroupMe?

  //
  //filter_messages(opts, sampleId);

}
