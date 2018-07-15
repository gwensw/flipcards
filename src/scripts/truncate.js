function truncate(title) {
  const mobilemax = 15; // max title length on narrow screens (750px)
  const allmax = 45; // max title length anywhere
  // const mobilewordmax = 11; // max length of any individual word on mobile
  // const allwordmax = 17; // max length of any individual word anywhere
  const len = title.length;
  const max = window.innerWidth > 350 ? allmax : mobilemax;
  let truncatedTitle = title;

  // if whole title longer than any max, truncate
  if (len > max) {
    const rgx = new RegExp(`.{${len - max}}$`);
    truncatedTitle = title.replace(rgx, '...');
  }
  return truncatedTitle;
}

export default truncate;
