

export function listCounties() {
  var CountyData = [
    "Dublin",
    "Cork",
    "Limerick",      
    "Galway",
    "Waterford",
    "Antrim",
    "Armagh",
    "Carlow",
    "Cavan",
    "Clare",
    "Cork",
    "Donegal",
    "Down",
    "Fermanagh",
    "Kerry",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Leitrim",
    "Londonderry",
    "Longford",
    "Louth",
    "Mayo",
    "Meath",
    "Monaghan",
    "Offaly",
    "Roscommon",
    "Sligo",
    "Tipperary",
    "Tyrone",
    "Westmeath",
    "Wexford",
    "Wicklow",
  ]
  return CountyData
}

export function timeRanges() {
  var timerange = [];
  var countval = 0
  for(var x = 500; x < 2400; x+=30) {
    if (countval === 2) {
      x = (x + 100) - 60
      countval = 0
    }
    countval = countval + 1
    timerange.push(reformatInput(x+""))
  }
  return timerange
}

function reformatInput(time) {
  if (time.length > 3 ) {
    time = time.slice(0, 2) + ":" + time.slice(2, 4)
    
  }
  else {
    time = "0" + time.slice(0, 1) + ":" + time.slice(1, 3)
  }
  return time
}
