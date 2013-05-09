var product_ids = [];
var aspects_ids = [];
var user_ids = [];
var products = {};
var aspects = {};
var users = {};
$(function(){
  get_products();
  get_aspects();
  get_users();
});
var counter = 2000;

function submit_comparison(){
  if(counter == 0){
    $("button").show();
    return;
  }
  $("button").hide();
  var postObj = {}; 
  postObj.from_pid  = r_e(product_ids,null);//$("#sid").val();
  postObj.to_pid    = r_e(product_ids,postObj.from_pid);//$("#sid").val();
  postObj.prefer_id = (Math.random()>0.5)? postObj.from_pid :postObj.to_pid;//$("#pid").val();
  postObj.user_id   = r_e(user_ids,null);;
  postObj.aspect_id = r_e(aspects_ids,null);//$("#aid").val();
  postObj.score     = 1;
  postObj.comment   = get_template().replace(/PRODUCT_FROM_ID/gi,products[postObj.from_pid].name).replace(/PRODUCT_TO_ID/gi,products[postObj.to_pid].name).replace(/ASPECT_ID/gi,aspects[postObj.aspect_id].name.toLowerCase());
  console.log(postObj.comment);
  ws.makeGenericPOSTRequest(root_url+"compare/c", postObj, function(response){
      console.log(counter);
      console.log(postObj.comment);
      console.log(response);
      counter -= 1;
      submit_comparison();
  });
}

function get_products(){
  ws.makeGenericGetRequest(root_url+"products", function(data){
      for (var i = data.length - 1; i >= 0; i--) {
        products[data[i].id] = data[i];
        product_ids.push(data[i].id);
      };
  });
}

function get_aspects(){
  ws.makeGenericGetRequest(root_url+"aspects", function(data){
      for (var i = data.length - 1; i >= 0; i--) {
        aspects[data[i].id] = data[i];
        aspects_ids.push(data[i].id);
      };
  });
}

function get_users(){
  ws.makeGenericGetRequest(root_url+"users", function(data){
      for (var i = data.length - 1; i >= 0; i--) {
        users[data[i].id] = data[i];
        user_ids.push(data[i].id);
      };
  });
}

function get_template(){
  var templates = $("#reason").val().split("/*n/");
  //return r_e(templates,null).trim();
  return r_multiple_e(templates,null).trim();
}

function r_e(items,ignore){
  var item;
  while(true){
    item = items[Math.floor(Math.random()*items.length)];
    if(item != ignore || ignore == null) break;
  }
  return item;
}

function r_multiple_e(items,ignore){
  var counter = 0;
  var chosen_list = [];
  var item = "";
  while(counter < 2){
    counter++;

    var rnd_num = Math.floor(Math.random()*items.length);
    while(chosen_list.indexOf(rnd_num)!=-1){
        rnd_num = Math.floor(Math.random()*items.length);
    }
    chosen_list.push(rnd_num);

    item = item + items[rnd_num] + "\n\n";
    if(item != ignore || ignore == null) break;
  }
  return item;
}