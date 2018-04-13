
export function sortByZh (array) {
  if(!String.prototype.localeCompare) return null;
  array.sort((a, b) => {
    return a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'})
  })
  return array
}

export function groupByZh (array) {
  if(!String.prototype.localeCompare) return null;

  let letters = "*abcdefghjklmnopqrstwxyz".split('');
  let zh = "阿八嚓哒妸发旮哈讥咔垃麻拏噢妑七呥扨它穵夕丫帀".split('');

  let segs = [];
  let curr;
  letters.forEach(function(item,i) {
    curr = {letter: item, data:[]};
    array.forEach(function(item2) {
      if((!zh[i-1] || zh[i-1].localeCompare(item2.nickname, 'zh-Hans-CN', {sensitivity: 'accent'}) <= 0) && item2.nickname.localeCompare(zh[i], 'zh-Hans-CN', {sensitivity: 'accent'}) === -1) {
        curr.data.push(item2);
      }
    });
    if(curr.data.length) {
      segs.push(curr);
      curr.data.sort(function(a, b) {
        return a.nickname.localeCompare(b.nickname, 'zh-Hans-CN', {sensitivity: 'accent'});
      });
    }
  });
  return segs;
}
