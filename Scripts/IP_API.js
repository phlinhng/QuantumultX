// http://ip-api.com/json/{query}?fields=1691189

if ($response.statusCode != 200) {
  $done(null);
}

const chs=Array.from("约亚济脱韩汤乌奥维韦岛诺开门伦库国圣买宾东兰爱马萨罗内赞别宁叙纳来鲜兹缅刚苏贝里麦湾扎属卢冈几莱尔挝关鲁达联长腊时")
const cht=Array.from("約亞濟脫韓湯烏奧維韋島諾開門倫庫國聖買賓東蘭愛馬薩羅內讚別寧敘納來鮮茲緬剛蘇貝裏麥灣紮屬盧岡幾萊爾撾關魯達聯長臘時")
const character = new Map()
chs.forEach( (key,index) => character.set(key, cht[index]) )

function toCHT(string) {
  var string_cht = ""
  Array.from(string).forEach( x => string_cht +=  character.get(x)? character.get(x):x )
  return string_cht
}

var region0 = "Lalaland";
var city0 = "Mega City";
var isp0 = "Cross-GFW.org";
var as0 = "AS77777 Not Found";

function Region_ValidCheck(para) {
  return para? para:region0;
}

function City_ValidCheck(para) {
  return para? para:city0;
}

function ISP_ValidCheck(para) {
  return para? para:isp0;
}

function ORG_ValidCheck(para_org,para_isp) {
  return para_org? para_org:ISP_ValidCheck(para_isp);
}

function AS_ValidCheck(para) {
  return para? para:as0;
}

function Area_check(para) {
  if (!para) return '';
  return para=="中华民国"? "台灣":toCHT(para);
}

function flagFromISO(cc) {
  if (!cc) return '';                      // 没有就返回空
  cc = String(cc).trim().toUpperCase();    // 规范化
  if (!/^[A-Z]{2}$/.test(cc)) return '';   // 必须是两位英文字母
  // 把 'A'..'Z' 转成区域指示符 U+1F1E6..U+1F1FF
  return String.fromCodePoint(
    ...cc.split('').map(ch => 0x1F1E6 + (ch.charCodeAt(0) - 65))
  );
}

function joinTight(...parts) {
  return parts.filter(Boolean).join(' ');
}

const body = $response.body;
const obj = JSON.parse(body);

const countrycode = (obj['countryCode'] || '').trim().toUpperCase();
const safeFlag = flagFromISO(countrycode) || '🇺🇳';

const proxyStatus = [
  obj['proxy'] && '🛡️',
  obj['hosting'] && '🌐',
].filter(Boolean).join('');

const title = joinTight(safeFlag, Area_check(obj['country']), proxyStatus)

const subtitle = joinTight(
  City_ValidCheck(obj.city),
  '(' + ORG_ValidCheck(obj.org, ISP_ValidCheck(obj.isp)) + ')'
);

const ip = obj['query'];

const descriptions = [
  joinTight(obj['query'], proxyStatus),
  ORG_ValidCheck(obj['org'], ISP_ValidCheck(obj['isp'])),
  AS_ValidCheck(obj['as']),
  City_ValidCheck(obj['city']) + ',  ' + Region_ValidCheck(obj['regionName']),
  safeFlag + ' ' + Area_check(obj['country'])
];
const description = descriptions.join('\n');

$done({title, subtitle, ip, description});
