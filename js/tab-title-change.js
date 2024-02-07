// change tab title
document.addEventListener("visibilitychange", function () {
  let originalTitle = "";
  if (document.hidden) {
    originalTitle = document.title;
    document.title = "(づ￣ ³￣)づ人家在这等你哦";
  } else {
    document.title = "WelcomeQwQ";
  }
});
