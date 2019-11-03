
options = typeof options != 'undefined' ? options : {}

options.borderStyle = '1px solid rgba(1,1,1,0.35);'
options.width       = 35     // px
options.separation  = 6      // px
options.wrap        = 10     // boxes
options.leftOffset  = 150    // px
options.topOffset   = 40     // px
options.showLeft    = false

clean   = function(n) { var x = Number(n.replace(/[^-\d\.]/g, '')); return x }
addDays = function(r, days) { return r.setDate(r.getDate() + parseInt(days)) }
days    = [ 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
months  = [ 'January','February','March','April','May','June','July','August','September','October','November','December']

renderTimely = function(len, tlen) {
  var d = ''
  var border = options.borderStyle
  var rEdge = 0
  var tEdge = 0
  var weekend = false
  for (var i = 0; i < len.days; i++) {
    var L = (i % options.wrap) * (options.width + options.separation) + options.leftOffset
    var T = Math.floor( i / options.wrap) * (options.width + options.separation) + options.topOffset
    var passed = false
    d += '<div id="box-' + i + '" class="box '
    
    // Marking passed days with .dead
    if (i < tlen.days) { d += 'dead ' }
    
    // Marking weekends with .weekend
    var then = new Date(0)
        then.setUTCSeconds(data.start / 1000)
    var G    = new Date(addDays(then, i))
    if (days[G.getDay()] == 'Saturday' || days[G.getDay()] == 'Sunday') { d += 'weekend '; weekend = true }
    
    // Construct the day
    d += '" data="' + i + '" style="left: ' + L + 'px; top: ' + T + 'px;'
    
    // Movement
    if (rEdge == 0 && i % options.wrap == (options.wrap - 1)) { rEdge = 1 }
    if (tEdge == 0 && Math.floor(i / options.wrap) < 1) { tEdge = T }
    
    // Borders for the collective
    if (!weekend) {
    if (Math.floor(i / options.wrap) == 0) {
        d += 'border-top: ' + border }
    if (i % options.wrap == 0) {
        d += 'border-left: ' + border }
    if (i % options.wrap == (options.wrap - 1)) {
        d += 'border-right: ' + border }
    if ((i + 1) == len.days) {
        d += 'border-right: ' + border }
    if (i / options.wrap >= Math.floor(len.days / options.wrap)) {
        d += 'border-bottom: ' + border }
    var LR = options.wrap - len.days % options.wrap
    if ((i + LR) / options.wrap >= Math.floor(len.days / options.wrap)) {
        d += 'border-bottom: ' + border }
    }
   
    d += '">'
    // d += '<div id="box-background-' + i + '" class="box-background"></div>'
    // d += '<div id="box-overground-' + i + '" class="box-overground" data="' + i + '"></div></div>'
    d += '</div>'
  }
  $('body').append(d)
  $('.box').css('width', options.width + 'px').css('height', options.width + 'px')
  $('.box-background').css('width', (options.width + 0) + 'px').css('height', (options.width + 0) + 'px')
  
  boxBehaviour()
  
  if (options.showLeft) {
    d  = '<div id="r">'
    d +=   '<div id="remainder">' + Math.floor(len.days - tlen.days) + '</div>'
    d +=   '<div id="adjoinder">days to</div>'
    d +=   '<div id="goal">' + data.goal + '</div>'
    d += '</div>'
    $('body').append(d)
    $('#r')
       .css('left', rEdge + (options.width + options.separation*5) + 'px')
       .css('top' , tEdge + 'px')
       .css('line-height', clean($('#remainder').css('font-size')) + 'px')
    $('#remainder').css('left', '0px')
    $('#adjoinder').css('left', clean($('#adjoinder').css('left')) + clean($('#remainder').css('width')) * 1.2 + 'px')
    $('#goal').css('left', clean($('#adjoinder').css('width')) * 1.2 + clean($('#adjoinder').css('left')) + 'px')
  }
}

boxBehaviour = function() {
  /* Mouseover Date */
  $('.box').on('mouseover', function(e) {
    var me = e.target
    var then = new Date(0)
        then.setUTCSeconds( data.start / 1000 )
    var G = new Date(addDays(then, $(me).attr('data')))
    var N = G.getDate()
    var suffix = 'th'
    var L = N.toString().charAt( N.toString().length - 1 )
    if ( L == '1' ) { suffix = 'st' }
    if ( L == '2' ) { suffix = 'nd' }
    if ( L == '3' ) { suffix = 'rd' }
      
    $('#tooltip').remove()
    var d = ''
        d += '<div id="tooltip" style="'
        d += ' left: ' + (e.clientX + 15) + 'px; ' + ' top: ' + (e.clientY + 15) + 'px; '
        d += ' ">' + G.getDate() + suffix
        d += ' ' + months[G.getMonth()] + '<br>' + '  ' + days[G.getDay()]
        d += '</div>'
        $(d).hide().appendTo('body').fadeIn('fast') // https://stackoverflow.com/a/847557/6881999
  }).on('mouseleave', function(e) { $('#tooltip').fadeOut('fast') })
}

behavioursUI = function() {
  /* Calendar UX Event */
  $(document).on('calendar-ux-change', function(e) {
    $('.box').remove()
    var u = calculate()
    renderTimely(u.len, u.tlen)
  })
    
  /* Manage Settings Subpanel Open/Close Button */
  document.getElementById('btn').addEventListener('click', function() {
   if (this.className == 'on') {
       this.classList.remove('on')
       $('#settings-content').css('right','-100%')
   } else {
       this.classList.add('on')
       $('#settings-content').css('right','0%')
   }
  })
}