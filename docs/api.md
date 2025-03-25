新浪期货数据接口
https://stock2.finance.sina.com.cn/futures/api/jsonp.php//InnerFuturesNewService.getDailyKLine?symbol=JM2505
https://stock2.finance.sina.com.cn/futures/api/jsonp.php//InnerFuturesNewService.getFewMinLine?symbol=JM2509&type=240


 实时数据
【例子】
http://hq.sinajs.cn/list=M0
豆粕连续 M0

返回值如下：
var hq_str_M0="豆粕连续,145958,3170,3190,3145,3178,3153,3154,3154,3162,3169,1325,223,1371608,1611074,连,豆粕,2013-06-28";

----------------------------------------------------------
查看 http://finance.sina.com.cn/futures/quotes/M0.shtml 页面，发现含义如下：

最新价:  3154 开盘价:  3170 最高价:  3190   最低价:  3145
结算价:  3162 昨结算:  3169 持仓量:  1371608 成交量:  1611074
买  价:  3153 卖  价:  3154 买  量:  1325  卖  量:  223

 

新浪期货数据接口 <wbr>API <wbr> <wbr>实时数据/历史数据


----------------------------------------------------------
这个字符串由许多数据拼接在一起，不同含义的数据用逗号隔开了，按照程序员的思路，顺序号从0开始。
0：豆粕连续，名字
1：145958，不明数字（难道是数据提供商代码？）
2：3170，开盘价
3：3190，最高价
4：3145，最低价
5：3178，昨日收盘价 （2013年6月27日）
6：3153，买价，即“买一”报价
7：3154，卖价，即“卖一”报价
8：3154，最新价，即收盘价
9：3162，结算价
10：3169，昨结算
11：1325，买  量
12：223，卖  量
13：1371608，持仓量
14：1611074，成交量
15：连，大连商品交易所简称
16：豆粕，品种名简称
17：2013-06-28，日期

 

 

----------------------------------------------

新浪期货数据各品种代码（商品连续）如下

 RB0 螺纹钢
 AG0 白银
 AU0 黄金
 CU0 沪铜
 AL0 沪铝
 ZN0 沪锌
 PB0 沪铅
 RU0 橡胶
 FU0 燃油
 WR0 线材
 A0 大豆
 M0 豆粕
 Y0 豆油
 J0 焦炭
 C0 玉米
 L0 乙烯
 P0 棕油
 V0 PVC
 RS0 菜籽
 RM0 菜粕
 FG0 玻璃
 CF0 棉花
 WS0 强麦
 ER0 籼稻
 ME0 甲醇
 RO0 菜油
 TA0 甲酸

 CFF_RE_IF1307  股指期货好像没有期指连续

 

品种名 + 0 （数字0），代表品种连续，如果是其他月份，请使用品种名 + YYYMM

例如豆粕 2013年09月，M1309

http://hq.sinajs.cn/list=M1309

 

 

一次可以请求多个品种，例如

http://hq.sinajs.cn/list=CFF_RE_IF1307,TA0,M0,CFF_RE_IF1306,RB1309,M1309,SR1309,TA1309,Y1309,P1309,C1309,FG1309,WS1309,A1309,L1309,CF1309,CU1303

 

返回值

var hq_str_CFF_RE_IF1307="2116,2217.8,2098,2168.6,1253068,808746000000,59806,2168.6,2144.6,2331.4,1907.8,,,2119,2119.6,70151,0,0,--,--,--,--,--,--,--,--,0,0,--,--,--,--,--,--,--,--,2013-06-28,15:33:30,0"; var hq_str_TA0="甲酸连续,145956,7842,7848,7774,7844,7826,7828,7826,7814,7836,19,22,472758,205716,郑,甲酸,2013-06-28"; var hq_str_M0="豆粕连续,145958,3170,3190,3145,3178,3153,3154,3154,3162,3169,1325,223,1371608,1611074,连,豆粕,2013-06-28"; var hq_str_CFF_RE_IF1306="2312.8,2322.6,2277.6,2315.6,57266,39596400000,0,2315.6,2315,2797.4,1865,,,2329.8,2331.2,13893,0,0,--,--,--,--,--,--,--,--,0,0,--,--,--,--,--,--,--,--,2013-06-21,15:38:30,0"; var hq_str_RB1309="螺钢1309,145957,3422,3468,3422,3440,3449,3452,3449,3447,3429,10,2,3750,3510,沪,螺钢,2013-06-28"; var hq_str_M1309="豆粕1309,145958,3495,3512,3455,3488,3460,3461,3460,3478,3500,330,228,784354,519734,连,豆粕,2013-06-28"; var hq_str_SR1309="白糖1309,145956,5172,5194,5165,5189,5192,5193,5192,5179,5184,5,198,334854,65036,郑,白糖,2013-06-28"; var hq_str_TA1309="甲酸1309,145956,7842,7848,7774,7844,7826,7828,7826,7814,7836,19,22,472758,205716,郑,甲酸,2013-06-28"; var hq_str_Y1309="豆油1309,145958,7120,7190,7112,7150,7150,7156,7152,7164,7140,55,42,318796,97838,连,豆油,2013-06-28"; var hq_str_P1309="棕油1309,145956,5760,5828,5760,5786,5782,5784,5784,5798,5780,21,3,235638,67818,连,棕油,2013-06-28"; var hq_str_C1309="玉米1309,145957,2417,2425,2415,2418,2418,2419,2418,2419,2413,43,95,427232,57906,连,玉米,2013-06-28"; var hq_str_FG1309="玻璃1309,145956,1371,1378,1365,1372,1371,1372,1371,1372,1369,2,336,203932,184978,郑,玻璃,2013-06-28"; var hq_str_WS1309="强麦1309,145955,2557,2558,2536,2552,2537,2538,2537,2543,2556,6,31,37406,14254,郑,强麦,2013-05-14"; var hq_str_A1309="豆一1309,145946,4789,4792,4784,4791,4789,4790,4789,4789,4789,4,26,64086,5938,连,豆一,2013-06-28"; var hq_str_L1309="乙烯1309,145958,10440,10485,10390,10440,10400,10405,10405,10440,10400,321,8,241618,188036,连,乙烯,2013-06-28"; var hq_str_CF1309="棉花1309,145954,20435,20470,20390,20445,20390,20415,20390,20440,20425,76,5,27778,2188,郑,棉花,2013-06-28"; var hq_str_CU1303="";
 
历史数据
 
新浪期货数据各品种代码（商品连续）如下
 RB0 螺纹钢
 AG0 白银
 AU0 黄金
 CU0 沪铜
 AL0 沪铝
 ZN0 沪锌
 PB0 沪铅
 RU0 橡胶
 FU0 燃油
 WR0 线材
 A0 大豆
 M0 豆粕
 Y0 豆油
 J0 焦炭
 C0 玉米
 L0 乙烯
 P0 棕油
 V0 PVC
 RS0 菜籽
 RM0 菜粕
 FG0 玻璃
 CF0 棉花
 WS0 强麦
 ER0 籼稻
 ME0 甲醇
 RO0 菜油
 TA0 甲酸
商品期货
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLineXm?symbol=CODE
例子：
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine5m?symbol=M0
5分钟http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine5m?symbol=M0
15分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine15m?symbol=M0
30分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine30m?symbol=M0
60分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine60m?symbol=M0
日K线
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=M0
http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=M1401
 
股指期货 5分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/CffexFuturesService.getCffexFuturesMiniKLine5m?symbol=IF1306
 
15
http://stock2.finance.sina.com.cn/futures/api/json.php/CffexFuturesService.getCffexFuturesMiniKLine15m?symbol=IF1306
30分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/CffexFuturesService.getCffexFuturesMiniKLine30m?symbol=IF1306

60分钟
http://stock2.finance.sina.com.cn/futures/api/json.php/CffexFuturesService.getCffexFuturesMiniKLine60m?symbol=IF1306

日线
http://stock2.finance.sina.com.cn/futures/api/json.php/CffexFuturesService.getCffexFuturesDailyKLine?symbol=IF1306

