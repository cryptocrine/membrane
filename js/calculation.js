
addDays = function(r, days) { return r.setDate(r.getDate() + parseInt(days)) } // https://stackoverflow.com/a/19691491/6881999

separation = function(time) {
  var secs  = time / 1000
  var mins  = secs / 60
      secs  = secs % 60
  var hrs   = mins / 60
      mins  = mins % 60
  var days  = hrs  / 24
      hrs   = hrs  % 24
  return {days: days, hours: hrs, secs: secs, mins: mins, base: time}
}

calculate = function() {
  var start = data.start
  var stop  = data.stop
  var fin   = new Date(0)
      fin.setUTCSeconds( stop / 1000 )
      stop  = addDays(fin, 1)
      
  // calculate length
  var len = separation(stop - start)
      
  // calculate traversed length
  var tlen = separation(new Date() - start)
      tlen.days = Math.floor(tlen.days) + 1
      
  return {len: len, tlen: tlen}
}
