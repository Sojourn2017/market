function send(response,status,msg,result) {
  return response.json({
    status: status,
    msg: msg,
    result:result ? result : ""
  })
}

module.exports = {
  send: send
};