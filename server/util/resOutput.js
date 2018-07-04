export function res_output(response,status,msg,result) {
  return response.json({
    status: status,
    msg: msg,
    result:result ? result : ""
  })
}