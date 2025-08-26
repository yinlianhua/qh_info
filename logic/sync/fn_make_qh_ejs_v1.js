/**
 * Date : 2025-03-25
 * By   : yinlianhua@sina.cn
 **/

'use strict';

let _      = require('underscore');
let moment = require('moment');
let ejs    = require("ejs");

const fn_make_qh_ejs_v1 = async (data=[]) => {
    let head = `
    <html xmlns = "http://www.w3.org/1999/xhtml">
        <head>
            <style>
                body {
                    -webkit-font-smoothing: antialiased;
                    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
                    font-size: 12px;
                    background-color: #F5F5F5;
                    padding: 40px;
                }
    
                table {
                    width: 100%;
                    background-color: transparent;
                    border-collapse: collapse;
                    border-spacing: 0;
                    boxing-size: border-box;
                    display: table;
                    border-color: gray;
                }
    
                table th {
                    vertical-align: bottom;
                    border-bottom: 2px solid #dddddd;
                    padding: 8px;
                    text-align: left;
                    border-color: gray;
                }
    
                tbody {
                    box-sizing: border-box;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
    
                table tr {
                    box-sizing:
                    border-box;
                }
    
                table tr th {
                    text-align: right;
                }
    
                td {
                    padding: 8px;
                    vertival-align: top;
                    border-top: 1px solid #dddddd;
                    text-align: right;
                }
    
                tbody > tr:nth-child(odd) > td {background-color: #f9f9f9;}
    
                tbody > tr:hover > td {
                    background-color: #f5f5f5;
                }
    
                .well {
                    background-color: #f5f5f5;
                    border: 1px solid #e3e3e3;
                    border-radius: 4px;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
                    margin-top: 15px;
                    padding: 19px;
                    box-sizing: border-box;
                }
    
                .well {
                    padding-right: 15px;
                    padding-left: 15px;
                }
    
                .col-xs-6 {
                    position: relative;
                    color: #788188;
                }
    
                .invoices caption {text-align: left}
    
                .axis path,.x.axis path {display: none;}
    
                .line {
                    fill: none;
                    stroke: steelblue;
                    stroke-width: 1.5px;
                }
    
                .node {
                    stroke: #fff;
                    stroke-width: 1.5px;
                }
    
                .grid .tick {
                    stroke: lightgrey;
                    opacity: 0.7;
                }
    
                .grid path {stroke-width: 0;}
    
                #tips h5 {color: rgb(255,0,0);}
                #org_name {
                    padding:5px;
                    margin-top:20px;
                }
                #org_name span {
                    background-color:rgb(52, 152, 219);
                    color:white;
                    font-size:20px;
                }
            </style>
        </head>
        <body>
    `;
    
    let tail = `
            <br/>
        </body>
    </html>`;

    // <th>基金代码</th>
    let ctx = `
<table id="state">
    <thead>
        <tr>
            <th width="5%">日期</th>
            <th width="15%">名称</th>
            <th width="5%">净值</th>
            <th width="5%">得分</th>
            <th width="5%">MA010</th>
            <th width="5%">MA020</th>
            <th width="5%">MA030</th>
            <th width="5%">MA060</th>
            <th width="5%">MA090</th>
            <th width="5%">MA120</th>
            <th width="10%">区间-030</th>
            <th width="10%">区间-060</th>
            <th width="10%">区间-090</th>
            <th width="10%">区间-120</th>
        </tr>
    </thead>
    <tbody>
    <% for (let i of data) { %>
        <tr>
            <td><%= i.date %></td>
            <td style="color:<%= i.c_name %>">&nbsp;<%= i.name %>&nbsp;</td>
            <td style="color:<%= i.c_latest %>">&nbsp;<%= i.latest %>&nbsp;</td>
            <td style="color:<%= i.c_score %>">&nbsp;<%= i.score %>&nbsp;</td>
            <td style="color:<%= i.c_avg010 %>">&nbsp;<%= i.avg010 %>&nbsp;</td>
            <td style="color:<%= i.c_avg020 %>">&nbsp;<%= i.avg020 %>&nbsp;</td>
            <td style="color:<%= i.c_avg030 %>">&nbsp;<%= i.avg030 %>&nbsp;</td>
            <td style="color:<%= i.c_avg060 %>">&nbsp;<%= i.avg060 %>&nbsp;</td>
            <td style="color:<%= i.c_avg090 %>">&nbsp;<%= i.avg090 %>&nbsp;</td>
            <td style="color:<%= i.c_avg120 %>">&nbsp;<%= i.avg120 %>&nbsp;</td>
            <td style="color:<%= i.c_030 %>">&nbsp;<%= i.min030 %> ~ <%= i.max030 %> <%= i.s_030 %>&nbsp;</td>
            <td style="color:<%= i.c_060 %>">&nbsp;<%= i.min060 %> ~ <%= i.max060 %> <%= i.s_060 %>&nbsp;</td>
            <td style="color:<%= i.c_090 %>">&nbsp;<%= i.min090 %> ~ <%= i.max090 %> <%= i.s_090 %>&nbsp;</td>
            <td style="color:<%= i.c_120 %>">&nbsp;<%= i.min120 %> ~ <%= i.max120 %> <%= i.s_120 %>&nbsp;</td>
        </tr>
    <% } %>
    </tbody>
</table>
`;

    let template = `${head}${ctx}${tail}`.toString();

    /*
    {
      code: 'FU2601',
      name: '燃油_2601',
      score: 10.08,
      latest: 2841,
      avg_05_120: 2830.63, max_05_120: 2856, min_05_120: 2763, pct_05_120: 0.84,
      avg_05_240: 2784.47, max_05_240: 2856, min_05_240: 2704, pct_05_240: 0.90,
      avg_15_120: 2759.23, max_15_120: 2856, min_15_120: 2691, pct_15_120: 0.91,
      avg_15_240: 2752.11, max_15_240: 2856, min_15_240: 2691, pct_15_240: 0.91,
      avg_240_12: 2756.58, max_240_12: 2849, min_240_12: 2691, pct_240_12: 0.95,
      avg_day_10: 2757.50, max_day_10: 2846, min_day_10: 2691, pct_day_10: 0.97,
      avg_day_30: 2803.94, max_day_30: 2985, min_day_30: 2691, pct_day_30: 0.51,
      avg_day_60: 2803.94, max_day_60: 2985, min_day_60: 2691, pct_day_60: 0.51,
    }
    */

    // return ejs.render(template, {"data" : data});
};

module.exports = fn_make_qh_ejs_v1;
