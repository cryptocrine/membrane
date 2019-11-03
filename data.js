/*
   data           
   loadData       
   manageCalendar 
   manageGoal     
 */

  data = {}
  data.start = new Date()
  data.stop  = new Date(new Date().setDate(data.start.getDate() + 30))

  /* Memory */
  if (typeof(Storage) !== 'undefined') {
    var w = window.localStorage
    var m = w.getItem('membra.ne')
        m = JSON.parse(m)
    if (m === null) {
        m = {start: data.start.getTime(), stop: data.stop.getTime(), goal: ''}
    } else {
        if (typeof m.start == 'undefined' || new Date(m.start) == 'Invalid Date') {
          m.start = data.start.getTime()
        } else {
          // do nothing
        }
        if (typeof m.stop == 'undefined' || new Date(m.stop) == 'Invalid Date') {
          m.stop = data.stop.getTime()
        } else {
          // do nothing
        }
        if (typeof m.goal == 'undefined' || typeof m.goal != 'string') {
          m.goal = ''
        } else {
          // do nothing
        }
    }
    data = m
    w.setItem('membra.ne', JSON.stringify(data))
  } else {
    // Sorry, web storage not supported
  }
  
  loadData = function() {
    $('#input-start').datepicker()
    $('#input-start').datepicker('setDate', new Date(data.start))
    $('#input-start').datepicker('option', 'dateFormat', 'dd M yy')
    
    $('#input-stop' ).datepicker()
    $('#input-stop' ).datepicker('setDate', new Date(data.stop) )
    $('#input-stop' ).datepicker('option', 'dateFormat', 'dd M yy')
    
    $('.ui-datepicker').hide()
    
    $('#input-goal').val(data.goal)
  }
  
  manageCalendar = function() {
    _start = $('#input-start').val()
    $('#input-start').datepicker('option', 'onSelect', function(e) {
      if (e != _start) { $(document).trigger('input-start-changed') }
    })
    _stop = $('#input-stop').val()
    $('#input-stop' ).datepicker('option', 'onSelect', function(e) {
      if (e != _stop) { $(document).trigger('input-stop-changed') }
    })
    
    $(document).on('input-start-changed', function() {
      data.start = new Date($('#input-start').datepicker('getDate')).getTime()
      _start     = data.start
      w.setItem('membra.ne', JSON.stringify(data))
      
      $(document).trigger('calendar-ux-change')
    })
    $(document).on('input-stop-changed', function() {
      data.stop  = new Date($('#input-stop' ).datepicker('getDate')).getTime()
      _stop      = data.stop
      w.setItem('membra.ne', JSON.stringify(data))
      
      $(document).trigger('calendar-ux-change')
    })
  }
  
  manageGoal = function() {
    $('#input-goal').on('keyup', function(e) {
      data.goal = $(this).val()
      $('#goal').text(data.goal)
    })
    $('#input-goal').focusout(function() {
      w.setItem('membra.ne', JSON.stringify(data))
      log('saved')
    })
  }
  