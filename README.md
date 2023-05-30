# OsmoGuide

### A Weather App with a TODO list where you can store your schedule for the day, and the app will organize and notify you which task is feasible based on the weather at that time.

So if for example you have 3 outdoor and 5 indoor tasks planned for the day, you can flag the outdoor tasks in the list and the app will categorize them accordingly and notify you if the weather may make that task impossible of not feasible at that time.

Let's say you have to buy groceries at 4pm today. If the app analyses that a rainstorm may occur at around that time, it will summarize a weather forecast saying that grocery shopping at that time will not be possible, and hence plan your indoor activities at that time for you, and suggest that you finish your shopping right now in the morning itself.

<hr>

- To build this functionality, we use 2 of the may APIs offered by **_OpenWeatherMap_** and nest one in the other.
- One of these APIs can only be used to give a forecast for that day and not for a week. Hence we fetch the _daily forecast_ from here as well as the _coordinates of the requested forecast location_ (if that location isn't your current location).
- We use these coordinates as inputs for the second API which fetches the _weekly_ weather forecast.
- All these fetched values are then displayed on the UI as required.
