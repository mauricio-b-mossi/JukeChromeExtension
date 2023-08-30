window.onload = () => {
  let url;
  let timeout;

  const urlRegex =
    /^(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|]$/i;

  const input = document.querySelector("input");
  const img = document.querySelector("img");
  const btn = document.querySelector('button')


  chrome.storage.local.get(["url"]).then((res) => {
    url = res.url;
    if (url) {
      input.value = url;
      img.src = stringBeforeIncluding(url, ".com/") + "favicon.ico";
      img.style.display = "block";
    }
  });

  btn.addEventListener("click", () => {
    input.value = ""
    chrome.storage.local.set({url : null})
    img.style.display = "none"
  })

  input.addEventListener("keyup", () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setTimeout(() => {
      const value = input.value;
      if (value.match(urlRegex)) {
        chrome.storage.local.set({ url: value }).then((res) => {
          console.log(`Value ${value} has been successully saved`);
          img.src = value.substring + "favicon.ico";
          img.style.display = "block"
        });
      } else {
        console.log("Invalid input");
      }
    }, 500);
  });
};

function stringBeforeIncluding(str, pattern){
    if(pattern.length > str.length) return null
    return str.substring(0, str.indexOf(pattern) + pattern.length)
}