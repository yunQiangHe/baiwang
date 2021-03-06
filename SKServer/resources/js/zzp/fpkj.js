var zzp_fpkj = function(){
	var maxRowIndex,nowRowIndex,maxZkRow,fskj;
	var qdbz;
	var w1,w2,w3,w4,w5,w6,w7,w8,w9;
	var hsbz;
	var defaultZbj,defaultYbj;
	var zhsl;
	var fpmx,blxx;
	var yfpdm, yfphm, xxbbh,tzdh;
	var zh, khbh,lshString;
	return {
		//增加行
		addRow : function(p) {
			var _this=this;
			if (maxRowIndex == 8 && fskj) {
				alert("已到最大行数，无法继续新增费用项目。");
				return;
			}
			maxRowIndex++;
			var place = _$("#fyxms tr[placeholder]:first");
			var newLine = $(_this.newLine(maxRowIndex));
			if (place[0]) {
				place.before(newLine);
			} else {
				_$("#fyxms tr:not([placeholder]):last").after(newLine);
			}
			_$("#fyxms tr[placeholder]:last").remove();
			limit_money_input(_$("#spsl_" + maxRowIndex + ",#spdj_" + maxRowIndex
					+ ",#je_" + maxRowIndex));
			if (p != "not_focus") {
				reFocus(_$("#spmc_" + maxRowIndex)[0]);
			}
			if (maxRowIndex == 1) {
				enableButtons(_$("#sc"));
				enableButtons(_$("#zk"));
			}
			if (!fskj) {
				this.checkNowRowCount(true);
			}
			
			//切换行
			newLine.find(":text:enabled,select").bind("focus",function(){
				var index = $(this).parents("tr:first").children("td:first");
				if(index.attr("rowselect")!="y"){
					var other = $(this).parents("table").find("tr:not([zkh])").find("td:first");
					other.attr("rowselect","n").text(function(){return $(this).attr("rowIndex")});
					index.attr("rowselect","y").text("->");
					nowRowIndex =  index.attr("rowIndex");
					if(index.attr("haszk")!="y"){
						_this.toggleZK(false);
					}else{
						_this.toggleZK(true);
					}
				}
			});
			
			//限制输入金额,计算金额
			newLine.find(":text[id^='spsl'],:text[id^='spdj']").bind("change",function(){
				var index = getIndex(this.id);
				var temp = new Number(this.value.replace(/-/,"")).toFixed(6);
				temp = delRight(new String(temp));
				var isdj = this.id.indexOf("dj")!=-1;
				this.value = temp = isdj?temp:fskj?(-temp):temp;
				this.value = this.value==0?"":this.value;
				var otherValue = isdj?_$("#spsl_"+index).val():_$("#spdj_"+index).val();
				if(temp!=""||otherValue!=""){
					var plusJe = temp*otherValue;
					if(Math.abs(plusJe)>99999999999.99){
						alert("您的输入有误,请修正单价或数量");
						this.value="";
						return;
					}
					var result=(plusJe).toFixed(2);
					_$("#je_"+index).val(result==0?"":result);
				}
				if(isdj){
					$(this).removeAttr("optDj");
					_$("#hsbz_"+index).val(hsbz?"y":"n");
				}
				_this.reCountRow(index);
			})
			//计算单价或数量
			newLine.find(":text[id^='je']").bind("change",function(){
				this.value = (this.value.replace(/-/,"")*(fskj?-1:1)).toFixed(2);
				if(this.value==0){
					this.value="";
				}
				var index = getIndex(this.id);
				var spsl = _$("#spsl_"+index);
				var spdj = _$("#spdj_"+index);
				if(spsl.val()!=""){
					spdj.val(delRight((this.value/spsl.val()).toFixed(6)));
					spdj.removeAttr("optDj");
					_$("#hsbz_"+index).val(hsbz?"y":"n");
				}else if(spdj.val()!=""){
					spsl.val(delRight((this.value/spdj.val()).toFixed(6)));
				}
				_this.reCountRow(index);
			})
			//税率变化计算
			newLine.find("select[id^='sl']").bind("change",function(){
				var index = getIndex(this.id);
				_$("#spdj_"+index).removeAttr("optDj");
				if(_$("#je_"+index).val()==""){
					return;
				}
				_this.reCountRow(index);
			})
			newLine.bind("dblclick",this.openFyxmDlg);
		},
		//打开费用项目dlg
		openFyxmDlg:function (){
			var url = ctxPath+"/zzp/selFyxm.do?targetType=dialog&index=";
			url += getIndex($(this).find("td:first").attr("rowindex"));
			url += "&hsbz="+hsbz;
			$.pdialog.open(url,"zzp_selFyxm_dlg","选择费用项目",{
				width:560,
				height:400
			})
		},
		//删除行
		delRow:function(){
			var _this=this;
			var td = _$("#row_"+maxRowIndex);
			if(td.attr("haszk")=="y"){
				alert("该行已添加折扣信息，请先删除此行的折扣信息！");
				reFocus(_$("#spmc_"+maxRowIndex)[0]);
				return;
			}
			if(maxRowIndex<9){
				_$("#fyxms").append(_this.newPlaceHolder());
				if(maxRowIndex==1){
					disableButtons(_$("#sc,#zk"))
				}
			}
			$(td.parent().remove());
			this.reCountHjje();
			this.checkNowRowCount(false);
			maxRowIndex--;
			reFocus(_$("#spmc_"+maxRowIndex)[0]);
		},
		//添加一行
		newLine : function (index){
			return "<tr><td id='row_"
				+ index + "' style='border-right:none;width:"+w1+"px;'" + " rowIndex='" + index+"'>" + index
				+ "</td><td style='width:"+w2+"px;border-right:1px solid green;'><input id='spmc_"
				+ index + "' name='spmc_" + index 
				+ "' maxlength='72' style='width:154px;'/></td><td style='width:"+w3+"px;border-right:1px solid green;'><input id='ggxh_" + index
				+ "' name='ggxh_" + index
				+ "' maxlength='36' style='width:72px;'/></td><td style='width:"+w4+"px;border-right:1px solid green;'><input id='dw_" + index
				+ "' name='dw_" + index + "' maxlength='14' style='width:40px;'/></td><td style='width:"+w5+"px;border-right:1px solid green;'><input id='spsl_"
				+ index + "' name='spsl_" + index
				+ "' style='text-align:right;width:72px;' maxlength='13'/></td><td style='width:"+w6+"px;border-right:1px solid green;'><input id='spdj_"
				+ index + "' name='spdj_" + index
				+ "' style='text-align:right;width:92px;' maxlength='13'/></td><td style='width:"+w7+"px;border-right:1px solid green;'><input id='je_"
				+ index + "' name='je_" + index
				+ "' style='text-align:right;width:114px;' maxlength='16'/></td><td style='width:"+w8+"px;border-right:1px solid green;'><select id='sl_"
				+ index + "' name='sl_" + index
				+ "' style='height:18px;width:54px;'>"+this.szsmStr+"</select></td>"
				+ "<td style='width:"+w9+"px;text-align:right;'><input id='se_" + index
				+ "' style='text-align:right;width:78px;' disabled='disabled'/>" +
				"<input id='hsbz_"+index+"' name='hsbz_"+index+"' " +
				"value='"+(hsbz?"y":"n")+"' type='hidden'/></td></tr>"
		},
		//检查是否超过8行
		checkNowRowCount : function (add){
			if(maxRowIndex+maxZkRow==9){
				if(!add){
					enableButtons(_$("#qd"));
					return;
				}
				if(!qdbz){
					this.toggleSyqd();
				}
				disableButtons(_$("#qd"));
				alertMsg.info('超过8行明细将必须使用清单打印，票面将只显示（详见销货清单）和折扣。')
			}
		},
		//计算行
		reCountRow:function (index){
			var sl = _$("#sl_"+index).val()*1;
			var dj = _$("#spdj_"+index).val();
			var spsl = _$("#spsl_"+index).val();
			var je = _$("#je_"+index).val();
			if(hsbz){
				if(sl!=""&&spsl!=""){
					_$("#se_"+index).val((dj*spsl*sl/(1+sl)).toFixed(2));
				}else{
					_$("#se_"+index).val((je*sl/(1+sl)).toFixed(2));
				}
			}else{
				if(sl!=""&&spsl!=""){
					_$("#se_"+index).val((dj*spsl*sl).toFixed(2));
				}else{
					_$("#se_"+index).val((je*sl).toFixed(2));
				}
			}
			this.reCountHjje();
		},
		//计算合计金额
		reCountHjje:function (){
			var hjje=0,se=0,jshj=0;
			_$("#fyxms :text[id^='je']").each(function(){
				hjje += $(this).val()*1;
			})
			_$("#fyxms :text[id^='se']").each(function(){
				se += $(this).val()*1;
			})
			hjje += _$("#hjzkje").text()*1;
			se += _$("#hjzkse").text()*1;
			if(hsbz){
				jshj = hjje.toFixed(2);
				hjje = jshj-se;
			}else{
				jshj = (hjje+se).toFixed(2);
			}
			_$("#jshj").text("￥"+jshj);
			_$("#hjje").text("￥"+hjje.toFixed(2));
			_$("#hjse").text("￥"+se.toFixed(2));
			_$("#jshjdx").text(je2Upper(jshj));
		},
		//切换清单状态
		toggleSyqd : function(){
			var syqd = _$("#qd");
			if(qdbz){
				syqd.text('使用清单');
				qdbz=false;
				_$("#spmctitle").text("货物或应税劳务名称");
			}else{
				syqd.text('取消清单');
				qdbz=true;
				_$("#spmctitle").html("<span style='color:red'>(清单)</span>货物或应税劳务名称")
			}
		},
		//切换是否含税
		toggleSfhs:function (){
			if(!hsbz){
				hsbz=true;
				_$("#sfhsstr").html("金额<span style='color:red'>(含税)</span>");
				_$("#djsfhsstr").html("单价<span style='color:red'>(含税)</span>");
				_$("#fyxms :text[id^='je']").each(function(){
					if(this.value!=""){
						var index = getIndex(this.id);
						this.value = (this.value*1+_$("#se_"+index).val()*1).toFixed(2);
					}
				})
				_$("#fyxms :text[id^='spdj']").each(function(){
					if(this.value!=""){
						var optDj = $(this).attr("optDj");
						if(optDj){
							$(this).attr("optDj",this.value);
							this.value=optDj;
						}else{
							$(this).attr("optDj",this.value);
							var index = getIndex(this.id);
							this.value = delRight((this.value*(1+_$("#sl_"+index).val()*1)).toFixed(6));
						}
					}
				})
				_$("#fyxms tr[zkh] td[id^=zkje]").each(function(){
					var index = getIndex(this.id);
					$(this).text(($(this).text()*1+_$("#zkse_"+index).text()*1).toFixed(2));
				})
			}else{
				hsbz=false;
				_$("#sfhsstr").text("金额(不含税)");
				_$("#djsfhsstr").text("单价(不含税)");
				_$("#fyxms :text[id^='je']").each(function(){
					if(this.value!=""){
						var index = getIndex(this.id);
						this.value = (this.value-_$("#se_"+index).val()).toFixed(2);
					}
				})
				_$("#fyxms :text[id^='spdj']").each(function(){
					if(this.value!=""){
						var optDj = $(this).attr("optDj");
						if(optDj){
							$(this).attr("optDj",this.value);
							this.value=optDj;
						}else{
							$(this).attr("optDj",this.value);
							var index = getIndex(this.id);
							this.value = delRight((this.value/(1+_$("#sl_"+index).val()*1)).toFixed(6));
						}
					}
				})
				_$("#fyxms tr[zkh] td[id^=zkje]").each(function(){
					var index = getIndex(this.id);
					$(this).text(($(this).text()-_$("#zkse_"+index).text()).toFixed(2));
				})
			}
			this.reCountZkje();
		},
		//打开添加折扣弹出框
		addZk:function (){
			var _this = this;
			var index = nowRowIndex;
			var td = _$("#row_"+index);
			//删除折扣
			if("y"==td.attr("haszk")){
				if(confirm("是否删除当前 "+td.attr("zkhs")+" 行的折扣信息？")){
					var tr = td.parent().next();
					while(tr.attr("zkh")!="y"){
						tr = tr.next();
					}
					var lastRow = tr.prev();
					tr.remove();
					var zkhs = td.attr("zkhs");
					for(var i=0;i<zkhs;i++){
						lastRow.children("td:first").removeAttr("zkhs").css("background-color","").attr("haszk","n");
						lastRow.find("td :text").removeAttr("readonly");
						lastRow.find("td select").removeAttr("disabled");
						lastRow.bind("dblclick",this.openFyxmDlg);
						lastRow = lastRow.prev();
						
					}
					this.reCountZkje();
					reFocus(td.next().children()[0]);
					this.toggleZK(false);
					this.checkNowRowCount(false);
					maxZkRow--;
				}
				return;
			}
			//计算可以折扣几行
			var selectRowSl = _$("#sl_"+index).val();
			var canZk = 0;
			for(var i=index;i>0;i--){
				if(_$("#row_"+i).attr("haszk")!="y"&&_$("#sl_"+i).val()==selectRowSl){
					var spmc = _$("#spmc_"+i);
					var je = _$("#je_"+i);
					if(spmc.val()==""||je.val()==""){
						alert("填写折扣前必须先填写商品名称和金额！");
						reFocus(spmc.val()==""?spmc[0]:je[0]);
						return;
					}
					canZk++;
				}else{
					break;
				}
			}
			$.pdialog.open(ctxPath+"/zzp/addZk.do","zzp_addZk_dlg","添加折扣",{
				width:450,
				height:240,
				callback:function(){
					$("#zkhs").empty();
					for(var i=1;i<=canZk;i++){
						$("#zkhs").append("<option value='"+i+"'>"+i+"</option>");
					}
					$("#spyje").text(_$("#je_"+index).val());
					$("#spyse").val(_$("#se_"+index).val());
					$("#zkl").focus();
					$("#dlg_save_bt").click(function(){
						_this.checkAddZK();
					})
					//折扣计算
					$("#zkl").keyup(function(){
						$("#zkje").val(($("#spyje").text()*this.value/100).toFixed(2));
					}).each(function(i){
						limit_money_input(this);
					})
					$("#zkje").keyup(function(){
						$("#zkl").val((100*this.value/$("#spyje").text()).toFixed(2));
					}).each(function(i){
						limit_money_input(this);
					})
					//折扣计算
					$("#zkhs").change(function(){
						var zkhs = this.value;
						var zje = 0;
						var zse = 0;
						for(var i=0;i<zkhs;i++){
							zje += _$("#je_"+(nowRowIndex-i)).val()*1;
							zse += _$("#se_"+(nowRowIndex-i)).val()*1;
						}
						$("#spyje").text(zje.toFixed(2));
						$("#spyse").val(zse.toFixed(2));
						if($("#zkl").val()!=""){
							$("#zkje").val(($("#spyje").text()*$("#zkl").val()/100).toFixed(2));
						}
					});
				}
			});
		},
		checkAddZK:function (){
			var zkl = $("#zkl");
			var zkje = $("#zkje");
			var spyje = $("#spyje");
			var zkjeval = new Number(zkje.val()*-1).toFixed(2);
			if(zkje.val()==""||zkl.val()==""||zkjeval==0||(maxRowIndex>1?(Math.abs(zkjeval)>spyje.text()):(Math.abs(zkjeval)>=spyje.text()))){
				alert("折扣金额或折扣率填写错误！");
				reFocus($("#zkl")[0]);
			}else{
				var index = nowRowIndex;
				var zkhs = $("#zkhs").val();
				var td = _$("#row_"+index);
				var zkslval = _$("#sl_"+index).val();
				var zkseval = hsbz?(zkjeval-zkjeval/(1+zkslval*1)).toFixed(2):(zkjeval*zkslval).toFixed(2);
				if(zkseval==0){
					zkseval="0.00";
				}
				td.parent().after("<tr zkh='y' index='"+index+"' style='color:red;text-align:right'>" +
						"<td width='15' style=''/>" +
						"<td width='151' style='text-align:left;border-right: 1px solid green;' id='zknr_"+index+"'>折扣行数"+zkhs+
						"（"+(zkl.val()*1).toFixed(3)+"%）</td>" +
						"<td width='84' style='border-right: 1px solid green;'/><td width='30' style='border-right: 1px solid green;'/>" +
						"<td width='56' style='border-right: 1px solid green;'/><td width='56' style='border-right: 1px solid green;'/>" +
						"<td width='98' style='text-align:right;border-right: 1px solid green;' id='zkje_"+index+"'>"+
						zkjeval +"</td>" +
						"<td width='52' style='text-align:right;border-right: 1px solid green;' id='zksl_"+index+"'>"+zkslval*100+
						"<span style='margin-right:5px;'>%</span></td>" +
						"<td style='text-align:right;' id='zkse_"+index+"'>"+zkseval + "</td></tr>");
				td.attr("haszk","y");
				for(var i=0;i<zkhs;i++){
					var tr = _$("#spmc_"+(index-i)).parents("tr:first");
					//去除双击事件
					tr.unbind("dblclick");
					tr.find("td :text").attr("readonly","readonly");
					tr.find("td select").attr("disabled","disabled");
					tr.children("td:first").attr("zkhs",zkhs).css("background-color","orange").attr("haszk","y");
				}
				//重新获取焦点
				reFocus(_$("#spmc_"+index)[0]);
				
				this.toggleZK(true);
				this.reCountZkje();
				maxZkRow++;
				this.checkNowRowCount(true);
				$.pdialog.closeCurrent();
			}
		},
		//添加占位行
		newPlaceHolder : function (){
			var str= "<tr placeholder='y'>" +
						"<td style='width:"+w1+"px;'></td>" +
				 		"<td style='width:"+w2+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w3+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w4+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w5+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w6+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w7+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w8+"px;border-right:1px solid green;'></td>" +
				 		"<td style='width:"+w9+"px;text-align:right;'><input disabled='disabled' style='width:10px;visibility: hidden;'/></td></tr>";
			return str;
		},
		//切换折扣状态
		toggleZK:function (a){
			if(a){
				_$('#zk').text('删除折扣')
			}else{
				_$('#zk').text('新增折扣')
			}
		},
		//计算合计折扣金额
		reCountZkje:function (){
			var zkzje = 0;
			var zkzse = 0;
			_$("#fyxms tr[zkh] td[id^='zkje']").each(function(){
				zkzje += $(this).text()*1;
			})
			_$("#fyxms tr[zkh] td[id^='zkse']").each(function(){
				zkzse += $(this).text()*1;
			});
			_$("#hjzkje").text(zkzje.toFixed(2));
			_$("#hjzkse").text(zkzse.toFixed(2));
			this.reCountHjje();
		},
		//开具校验
		validateZsfp:function (){
			_$(".fp-content-center :text:not(:disabled),textarea").val(function(){return qj2bj($.trim(this.value));});
			if(maxRowIndex==0){
				alert("请添加费用项目");
				this.addRow();
				return false;
			}
			var ghdwmc = _$("#ghdwmc")[0];
			if(ghdwmc.value==""){
				alert("购货单位名称不能为空");
				reFocus(ghdwmc);
				return false;
			}else if(countStrLength(ghdwmc.value)>100){
				alert("购货单位名称最多为100个字符或50个汉字");
				reFocus(ghdwmc);
				return false;
			}
			var ghdwdm = _$("#ghdwdm")[0];
			var regex = /^[a-zA-Z0-9]{15,20}$/;
			if(ghdwdm.value==""){
				alert("购货单位识别号不能为空");
				reFocus(ghdwdm)
				return false;
			}else if(!regex.test(ghdwdm.value)){
				alert("购货单位识别号为15-20位数字或大写字母");
				reFocus(ghdwdm)
				return false;
			}else if(ghdwdm.value*1==0){
				alert("购货单位识别号不能全为0！");
				reFocus(ghdwdm);
				return false;
			}
			
			var ghdwdzdh = _$("#ghdwdzdh")[0];
			if(ghdwdzdh.value==""){
				alert("购货单位地址电话不能为空");
				reFocus(ghdwdzdh);
				return false;
			}else if(countStrLength(ghdwdzdh.value)>100){
				alert("购货单位地址电话最多为100个字符或50个汉字");
				reFocus(ghdwdzdh);
				return false;
			}
			var ghdwyhzh = _$("#ghdwyhzh")[0];
			if(ghdwyhzh.value==""){
				alert("购货单位银行账号不能为空");
				reFocus(ghdwyhzh);
				return false;
			}else if(countStrLength(ghdwyhzh.value)>100){
				alert("购货单位银行账号最多为100个字符或50个汉字");
				reFocus(ghdwyhzh);
				return false;
			}
			
			var bz = _$("#bz")[0];
			if(bz.value.indexOf("?")!=-1){
				alert("备注中非法字符?禁止输入");
				reFocus(bz);
				return false;
			}else if(countStrLength(bz.value)>184){
				alert("备注最多为184个字符或92个汉字");
				reFocus(bz);
				return false;
			}
			var skr = _$("#skr")[0];
			if(countStrLength(skr.value)>16){
				alert("收款人最多为16个字符或8个汉字");
				reFocus(skr);
				return false;
			}
			var fhr = _$("#fhr")[0];
			if(countStrLength(fhr.value)>16){
				alert("复核人最多为16个字符或8个汉字");
				reFocus(fhr);
				return false;
			}
			var kpr = _$("#kpr")[0];
			if(countStrLength(kpr.value)>16){
				alert("开票人最多为16个字符或8个汉字");
				reFocus(kpr);
				return false;
			}
			if (countStrLength(kpr.value) == 0) {
				alert("开票人不允许为空！");
				reFocus(kpr);
				return false;
			}
			var spmcs = _$("#fyxms :text[id^='spmc']"); 
			for(var i=0;i<spmcs.length;i++){
				var spmc = spmcs[i];
				var index = getIndex(spmc.id);
				var ggxh = _$("#ggxh_"+index)[0];
				var dw = _$("#dw_"+index)[0];
				var je = _$("#je_"+index)[0];
				if(spmc.value==""){
					alert("货物或应税劳务名称不能为空");
					reFocus(spmc);
					return false;
				}else if(countStrLength(spmc.value)>72){
					alert("货物或应税劳务名称最多为72个字符或36个汉字");
					reFocus(spmc);
					return false;
				}
				if(countStrLength(ggxh.value)>36){
					alert("规格型号最多为36个字符或18个汉字");
					reFocus(ggxh);
					return false;
				}
				if(countStrLength(dw.value)>14){
					alert("单位最多为14个字符或7个汉字");
					reFocus(dw);
					return false;
				}
				if(je.value==""){
					alert("金额不能为空");
					reFocus(je);
					return false;
				}
			}
			return true;
		},
		//开具前生成其他辅助输入项
		addExtraInfo:function (){
			_$("#extraDiv").remove();
			var extraDiv = $("<div id='extraDiv'/>").hide();
			_$("#zzp_fpkj_form").append(extraDiv);
			extraDiv.append("<input name='hjzkje' value='"+_$("#hjzkje").text()+"'/>");
			extraDiv.append("<input name='hjzkse' value='"+_$("#hjzkse").text()+"'/>");
			extraDiv.append("<input name='hjje' value='"+delLeftMoney(_$("#hjje").text())+"'/>");
			extraDiv.append("<input name='hjse' value='"+delLeftMoney(_$("#hjse").text())+"'/>");
			extraDiv.append("<input name='jshj' value='"+delLeftMoney(_$("#jshj").text())+"'/>");
			extraDiv.append("<input name='sfhs' value='"+(hsbz?"y":"n")+"'/>");
			extraDiv.append("<input name='qdbz' value='"+(qdbz?"y":"n")+"'/>");
			extraDiv.append("<input name='xxbbh' value='"+xxbbh+"'/>");
			extraDiv.append("<input name='tzdh' value='"+tzdh+"'/>");
			extraDiv.append("<input name='yfpdm' value='"+yfpdm+"'/>");
			extraDiv.append("<input name='yfphm' value='"+yfphm+"'/>");
			extraDiv.append("<input name='lshString' value='"+lshString+"'/>");
			//判断是否统一税率
			var slArray = _$("#fyxms select[id^=sl]").get();
			var isAll = true;
			for(var i=1;i<slArray.length;i++){
				var index = getIndex(slArray[i].id);
				if(slArray[i].value!=slArray[0].value){
					isAll=false;
					break;
				}
			}
			if(isAll){
				extraDiv.append("<input name='allSL' value='"+slArray[0].value+"'/>")
			}
			//追加禁用的税率select
			_$("#fyxms select:disabled[id^=sl]").each(function(){
				extraDiv.append("<input name='"+this.name+"' value='"+this.value+"'/>");
			});
			//追加税额
			_$("#fyxms :text[id^='se']").each(function(){
				//追加折扣标志
				var index = getIndex(this.id);
				var td = _$("#row_"+index);
				extraDiv.append("<input name='zkbz_"+index+"' value='"+(td.attr("haszk")=="y"?"y":"n")+"'/>")
				extraDiv.append("<input name='"+this.id+"' value='"+this.value+"'/>");
			})
			var bhshjzkje = 0;
			if(!fskj){
				//追加折扣行
				_$("#fyxms tr[zkh]").each(function(){
					var index = $(this).attr("index");
					var zknr = _$("#zknr_"+index).text();
					var zkje = _$("#zkje_"+index).text();
					var zksl = delRightPercent(_$("#zksl_"+index).text())/100;
					var zkse = _$("#zkse_"+index).text();
					//含税时传不含税折扣金额
					if(hsbz){
						zkje = (zkje-zkse).toFixed(2);
						bhshjzkje += zkje*1;
					}
					extraDiv.append("<input name='zknr_"+index+"' value='"+zknr+"'/>")
					.append("<input name='zkje_"+index+"' value='"+zkje+"'/>")
					.append("<input name='zksl_"+index+"' value='"+zksl+"'/>")
					.append("<input name='zkse_"+index+"' value='"+zkse+"'/>");
				})
				//追加含税时的不含税折扣总金额
				if(hsbz){
					extraDiv.append("<input name='bhshjzkje' value='"+bhshjzkje.toFixed(2)+"'/>");
				}
			}else{
				//添加负数开具状态
				extraDiv.append("<input name='fskj' value='1'/>");
			}
			//转换含税金额、单价
			if(hsbz){
				_$("#fyxms :text[id^='je']").each(function(){
					var index = getIndex(this.id);
					var bhsje = _$("#je_"+index).val()-_$("#se_"+index).val();
					extraDiv.append("<input name='bhsje_"+index+"' value='"+bhsje.toFixed(2)+"'/>");
				});
				_$("#fyxms :text[id^=spdj]").each(function(){
					var realDj=this.value,index = getIndex(this.id);
					if(realDj!=""){
						if($(this).attr("optDj")){
							realDj = $(this).attr("optDj");
						}else{
							realDj = delRight((this.value/(1+_$("#sl_"+index).val()*1)).toFixed(6));
						}
					}
					extraDiv.append("<input name='realdj_"+index+"' value='"+realDj+"'/>");
				});
			}
		},
		kjcg:function(json){
			navTabAjaxDone(json);
			if (json.statusCode == DWZ.statusCode.ok){
				disableButtons(_$("#xz,#sc,#zk,#jg,#qd,#kj,#fs,#cxgfxx,#jylsh,#fyxm"));
				_$("#yl,#dy,#xyz").parent().parent().show();
				_$('.fp-content-center :text,.fp-content-center select,.fp-content-center textarea').attr('disabled','disabled');
				_$("#fpdm").text(json.kjjg.fpdm);
				_$("#fphm").text(json.kjjg.fphm);
				var kprq = json.kjjg.kprq;
				_$("#kprq").text(kprq.substring(0,4)+"年"+kprq.substring(4,6)+"月"+kprq.substring(6,8)+"日");
				var skm = json.kjjg.skm;
				for (var i = 1; i <= 4; i++) {
					_$("#skm").append($("<span style='font-size:14px;font-family: Courier New;'/>").text(skm.substring(i * 28 - 28, i * 28))).append("<br/>");
				}
				fpmx = json.kjjg;
				fpmx.ewm = json.ewm;
			}
		},
		//单价数量是否超13位校验
		djslJy:function(){
			var djslFlag = true;
			var djRows = "";
			var slRows = "";
			_$("#fyxms :text[id^=spdj]").each(function(){
				var spdj=this.value;
				var index = getIndex(this.id);
				if((spdj+"").length>13){
					djRows = djRows + index + "、";
				}
			});
			_$("#fyxms :text[id^=spsl]").each(function(){
				var spsl=this.value;
				var index = getIndex(this.id);
				if((spsl+"").length>13){
					slRows = slRows + index + "、";
				}
			});
			if(!(djRows=="" && slRows=="")){
				djslFlag = false;
				if(confirm((djRows!=""?("第"+djRows.substring(0,djRows.length-1)+"行单价 "):"")+(slRows!=""?("第"+slRows.substring(0,slRows.length-1)+"行数量"):"")+"长度超过13位，打印时会出现换行，影响打印效果，您确定要继续开具吗？")) {
					djslFlag = true;
				}
			}
			return djslFlag;
		},
		//打开负数弹出框
		openFskjDlg : function(){
			var _this = this;
			$.pdialog.open(ctxPath+"/zzp/fskjDlg.do","zzp_fskjDlg_dlg","导入开具请上传信息表文件或者手工输入请填写信息表编号",{
				width:500,
				height:302,
				callback:function(){
					$("#dlg_next_bt").click(function(){
						disableButtons(_$("#fyxm"));
						//校验信息表
						if(!_this.jyxxb()){
							//整理开具负数需要的状态
							_this.preFskj();
						}else{
							return;
						}
						ajaxLoad(ctxPath+"/zzp/xybjy.do",{xxbbh:xxbbh,yfpdm:yfpdm,yfphm:yfphm},function(json){
							if(json.xybjyError){
								alert(json.xybjyError);
								disableButtons(_$("#xz,#sc,#jg,#kj,#fs"));
								return;
							}
							if(json.xybjyRight){
								if(sk_version=='ABC' || sk_version=='BOC'){
									alert("在当前发票库中没有找到相应正数发票，不能开具负数发票，请检查！");
									disableButtons(_$("#kj"));
									return;
								}
								alert(json.xybjyRight);
								_$("#kj").parent().parent().show();
								return;
							}
							_this.setValueFromYfp1(json.hzfpmx);
						});
					});
				}
			});
		},
		hzxxbht:function(json){
			dialogAjaxDone(json);
			if(json.hzfpmx){
				disableButtons(_$("#fyxm"));
				tzdh = json.hzfpmx.tzdh;
				yfpdm = json.hzfpmx.fpdm;
				yfphm = json.hzfpmx.fphm;
				zzp_fpkj.setValueFromYfp(json.hzfpmx);
			}else{
				return;
			}
		},
		//校验信息表
		jyxxb : function(){
			xxbbh = $("#xxbbh").val() ;
			var zcsr = $("#zcsr").val() ;
			yfpdm = $("#yfpdm").val() ;
			yfphm = $("#yfphm").val() ;
			var dmhm = yfpdm+yfphm;
			//校验输入
			if(!/\d{16}/.test(xxbbh)){
				alert("信息表编号填写有误！");
				return true;
			}else if(/^0+$/.test(yfpdm)||/^0+$/.test(yfphm)||(dmhm.length<18&&dmhm.length!=0)){
				alert("发票代码号码填写有误！");
				return true;
			}
			if(xxbbh != zcsr){
				alert("信息表编号两次录入不一致，请重新输入！") ;
				return true ;
			}else{
				//校验信息表编号是否正确
				var crcSum = 0;
				var len = xxbbh.length ;
				for (var x = 0; x < len-1; x++) { //计算检验数据
					var a = Number(xxbbh.substring(x, x + 1));
					crcSum = crcSum + a ;
				}
				var last = Number(xxbbh.substring(len-1,len)) ; //获取信息表最后一位
				var crcStr = String(crcSum) ; //将校验数据转换为字符串。
				len = crcStr.length ;
				var jyw = crcStr.substring(len-1,len);
				if(last != jyw){
					alert("信息表编号校验失败，请重新录入！") ;
					return true ;
				}
			}
			return false;
		},
		//整理开具负数需要的状态
		preFskj : function(){
			$.pdialog.closeCurrent();
			_$("#zk,#qd,#fz").parent().parent().hide();
			var fyxm_table = _$("#fyxms");
			fyxm_table.empty();
			for (var index = 1; index <= 8; index++) {
				fyxm_table.append(this.newPlaceHolder());
			}
			maxRowIndex = 0,nowRowIndex = 0,maxZkRow = 0;
			if(_$("#fsdx")){
				_$("#fsdx").remove();
			}
			_$("#jshjdx").before("<span id='fsdx' style='color:red'>(负数)</span>");
			_$("#spmctitle").text("货物或应税劳务名称");
			_$("#qdbz").val("n");
			if(_$("#hzxxbbh")){
				_$("#hzxxbbh").remove();
			}
			_$("#bz").before("<span id='hzxxbbh' style='color:red;float: left;'>红字发票信息表编号:"+ xxbbh + "</span>").attr("rows","3");
			fskj = true;
		},
		//红字信息表文件数据回填
		setValueFromYfp:function (yfp){
			if(yfp == null){
				return;
			} 
			//删除当前存在的子项
			for(var i=1;i<=maxRowIndex;i++){
				this.delRow();
			}	
			//有原发票信息
			_$('.fp-content-center input,.fp-content-center select').attr('readonly','readonly');
			_$("#ghdwyhzh,#ghdwdzdh").removeAttr('readonly');
			_$("#skr,#fhr,#kpr").removeAttr('readonly');
			disableButtons(_$("#xz,#sc,#qd,#fs"));
			if(hsbz){
				this.toggleSfhs();
			}
			//开始回填票面项目
			_$("#ghdwmc").val(yfp.ghdwmc);
			_$("#ghdwdm").val(yfp.ghdwdm);
			_$("#ghdwdzdh").val(yfp.ghdwdzdh);
			_$("#ghdwyhzh").val(yfp.ghdwyhzh);
			_$("#hzxxbbh").remove();
			_$("#bz").val("");
			_$("#bz").before("<span id='hzxxbbh' name='hzxxbbh' style='color:red;float: left;'>"+ yfp.bz.substring(0, 35) + "</span>").attr("rows","3");
			_$("#jshjdx").before("<span style='color:red'>(负数)</span>");
			_$("#jshjdx").text(je2Upper(yfp.jshj));
			_$("#hjje").text((yfp.hjje).toFixed(2));
			_$("#hjse").text((yfp.se==0?0:yfp.se).toFixed(2));
			//子表
			var mxzb = yfp.mxzb;
			for(var i=1;i<=mxzb.length;i++){
				this.addRow();
				_$("#row_"+i).parent().unbind("dblclick");
				_$("#spmc_" + i).val(mxzb[i - 1].spmc);
				_$("#spmc_"+i).attr('readonly','readonly');
				_$("#ggxh_" + i).val(mxzb[i - 1].ggxh);
				_$("#ggxh_"+i).attr('readonly','readonly');
				_$("#dw_" + i).val(mxzb[i - 1].dw);
				_$("#dw_"+i).attr('readonly','readonly');
				_$("#spsl_" + i).val(mxzb[i - 1].spsl ? delRight((mxzb[i - 1].spsl).toFixed(6)) : "");
				_$("#spsl_"+i).attr('readonly','readonly');
				_$("#spdj_" + i).val(mxzb[i - 1].spdj ? delRight(mxzb[i - 1].spdj.toFixed(6)) : "");
				_$("#spdj_"+i).attr('readonly','readonly');
				_$("#je_" + i).val((mxzb[i - 1].je).toFixed(2));
				_$("#je_"+i).attr('readonly','readonly');
				var sl=mxzb[i - 1].sl;
				var slSel = _$("#sl_" + i).attr("disabled","disabled");
				if(sl==""){
					zhsl="99.01";
					slSel.empty();
				}else{
					_$("#sl_" + i).val(mxzb[i - 1].sl ? ((mxzb[i-1].sl+"").length>4&&(mxzb[i-1].sl+"").substring(4,5)*1>0?mxzb[i-1].sl.toFixed(3):mxzb[i-1].sl.toFixed(2)) : "");
				}
				_$("#se_" + i).val(mxzb[i - 1].se ? (mxzb[i - 1].se).toFixed(2) : "0.00");
			}
			fskj = true;
			this.reCountHjje();
			_$("#kj").parent().parent().show();
			if(sk_version=='ABC'){
				_$('.fp-content-center :input').attr('readonly','readonly');
				_$("#ghdwmc,#ghdwdm,#ghdwyhzh,#ghdwdzdh").each(function(){
					if($.trim(this.value)==""){
						$(this).removeAttr('readonly');
						$(this).attr('minL','100');
					}
				});
				_$('#fyxms tr').unbind('dblclick');
			}
		},
		//红字信息回填
		setValueFromYfp1:function (yfp){
			if (yfp == null) {
				return;
			}
			//删除当前存在的子项
			for(var i=1;i<=maxRowIndex;i++){
				this.delRow();
			}
			//有原发票信息
			_$('.fp-content-center input,.fp-content-center select').attr('readonly','readonly');
			_$("#ghdwyhzh,#ghdwdzdh").removeAttr('readonly');
			_$("#skr,#fhr,#kpr").removeAttr('readonly');
			if(hsbz){
				this.toggleSfhs();
			}
			disableButtons(_$("#sc"));
			// 开始回填票面项目
			_$("#ghdwmc").val(yfp.ghdwmc);
			_$("#ghdwdm").val(yfp.ghdwdm);
			_$("#ghdwdzdh").val(yfp.ghdwdzdh);
			_$("#ghdwyhzh").val(yfp.ghdwyhzh);
			_$("#bz").val("");
			_$("#jshjdx").text(je2Upper(yfp.jshj));
			_$("#hjje").text((-yfp.hjje).toFixed(2));
			_$("#hjse").text((yfp.se == 0 ? 0 : -yfp.se).toFixed(2));
			// 子表
			var mxzb = yfp.mxzb;
			for ( var i = 1; i <= mxzb.length; i++) {
				this.addRow();
				_$("#row_"+i).parent().unbind("dblclick");
				_$("#spmc_" + i).val(mxzb[i - 1].spmc);
				_$("#ggxh_" + i).val(mxzb[i - 1].ggxh);
				_$("#dw_" + i).val(mxzb[i - 1].dw);
				_$("#spsl_" + i).val(mxzb[i - 1].spsl ? delRight((-mxzb[i - 1].spsl).toFixed(6)) : "");
				_$("#spdj_" + i).val(mxzb[i - 1].spdj ? delRight(mxzb[i - 1].spdj.toFixed(6)) : "");
				_$("#je_" + i).val((-mxzb[i - 1].je).toFixed(2));
				//多税率
				var slSel = _$("#sl_" + i).attr("disabled","disabled");
				if(yfp.zhsl==99.01 && yfp.qdbz==1){
					slSel.empty();
				}
				_$("#sl_" + i).val(mxzb[i - 1].sl ? ((mxzb[i-1].sl+"").length>4&&(mxzb[i-1].sl+"").substring(4,5)*1>0?mxzb[i-1].sl.toFixed(3):mxzb[i-1].sl.toFixed(2)) : "");
				_$("#se_" + i).val(mxzb[i - 1].se ? (-mxzb[i - 1].se).toFixed(2) : "0.00");
			}
			fskj = true;
			this.reCountHjje();
			_$("#kj").parent().parent().show();
			if(sk_version=='ABC'){
				_$('.fp-content-center :input').attr('readonly','readonly');
				_$("#ghdwmc,#ghdwdm,#ghdwyhzh,#ghdwdzdh").each(function(){
					if($.trim(this.value)==""){
						$(this).removeAttr('readonly');
						$(this).attr('minL','100');
					}
				});
				_$('#fyxms tr').unbind('dblclick');
			}
		},
		//查询购方信息
		cxgfxx:function(){
			var _this=this;
			$.pdialog.open(ctxPath+"/zzp/gfxxDlg.do","zzp_cxgfxx_dlg","查询购方信息",{
				width:600,
				height:215,
				callback:function(){
					$("#dlg_next_bt").click(function(){
						if(!_this.jyzh()){
							return;
						}
						var success = false;
						ajaxLoad(ctxPath+"/cbc/callByCstAccNo.do",{zh:zh,khbh:khbh},function(data){
							
							var nsrflag = data.flag ;
							var gfdh = data.gfdh ;
							//如果查询出购方是个人，不能开具专票
							if(nsrflag == '1' && data.code == '0'){
								alertMsg.error("查询到购方纳税人不是一般纳税人，不能开具增值税专用发票！");
								disableButtons(_$("#kj"));
								return;
							}
							
							if(data.code == '0'){
								
								var nsrxx = $.parseJSON(data.nsrxx);
								
								//如果通过建行接口没有查询到购方信息，则进行提示
								if(nsrflag == '0'){
									var json = {} ;
									var msg = "" ;
									//获取国税登记证信息中的识别信息号
									var gfsh = nsrxx.STATE_TAX_GUP.Id_Inf_No ;
									//国税登记证信息中的识别信息号不为空
									if(gfsh.length == 0){
										//国税登记证信息中的识别信息号为空
										gfsh = nsrxx.LOCAL_TAX_GUP.Id_Inf_No ;
									}
									if(gfsh){
										json.gfsbh = gfsh ;
									}else{
										msg = msg + "纳税人识别号" ;
									}				
									if(nsrxx.LEGAL_NM_GUP.IP_Nm){
										//购方名称
										json.gfmc = nsrxx.LEGAL_NM_GUP.IP_Nm ;
									}else{
										msg = msg + (msg.length > 0 ? '、' : '') ;
										msg = msg + "客户名称" ;
									}
									if(!nsrxx.REG_ADDR_GUP.Dtl_Adr){
										msg = msg + (msg.length > 0 ? '、' : '') ;
										msg = msg + "地址" ;
									}
									if(!gfdh){
										msg = msg + (msg.length > 0 ? '、' : '') ;
										msg = msg + "电话" ;
									}
									//地址电话
									var dzdh = nsrxx.REG_ADDR_GUP.Dtl_Adr + gfdh ;
									
									if(!nsrxx.OPI_GUP.Bsc_Dep_Acc_DpBkNm){
										msg = msg + (msg.length > 0 ? '、' : '') ;
										msg = msg + "开户行" ;
									}
									if(!nsrxx.OPI_GUP.Bsc_Dep_AccNo){
										msg = msg + (msg.length > 0 ? '、' : '') ;
										msg = msg + "账号" ;
									}
									//银行账号
									var yhzh = nsrxx.OPI_GUP.Bsc_Dep_Acc_DepBnk_Cd_DESC + nsrxx.OPI_GUP.Bsc_Dep_Acc_DpBkNm + nsrxx.OPI_GUP.Bsc_Dep_AccNo ;
									json.gfdzdh = dzdh ;
									json.gfyhzh = yhzh ;
									
									//购方客户规模
									if(nsrxx.OPS_GUP.Taxpyr_Sz_Cd != '1'){
										alertMsg.error("经检索对公客户信息查询到该客户不是一般纳税人，无法开具专用发票。请提示客户持一般纳税人证明资料联系客户经理，并要求客户经理在“对公客户信息”中维护客户规模为“一般纳税人”后，再执行开票操作");
										disableButtons(_$("#kj"));
										return;
									}
									
									if(msg!=""){
										alertMsg.warn("该客户没有" + msg + "，请联系客户经理在“对公客户信息”中维护缺失信息后，再执行开票操作！") ;
										disableButtons(_$("#kj"));
										return;
									}
									
									_$("#ghdwmc").val(json.gfmc);
									_$("#ghdwdm").val(json.gfsbh);
									_$("#ghdwdzdh").val(json.gfdzdh);
									_$("#ghdwyhzh").val(json.gfyhzh);
								}									
								
							}else{
								alertMsg.warn(data.msg);
								disableButtons(_$("#kj"));
								return;
							}
							
							enableButtons(_$("#kj"));
							$.pdialog.closeCurrent();
						});
					});
				}
			});
		},
		//校验帐号和客户编号
		jyzh: function(){
			zh = $("#zh").val() ;
			var qrzh = $("#qrzh").val() ;
			khbh = $("#khbh").val() ;
			var qrkhbh = $("#qrkhbh").val() ;
			
			if(zh == "" && khbh == ""){
				alert("请输入帐号或者客户编号！") ;
				return false;
			}
			
			if(zh.length > 0 && khbh.length > 0){
				alert("只能选择账号或者客户编号其一进行查询！") ;
				return false;
			}
			
			if(zh != "" && qrzh == ""){
				alert("请输入确认帐号！") ;
				return false;
			}
			
			if(khbh != "" && qrkhbh == ""){
				alert("请输入确认客户编号！") ;
				return false;
			}

			if(zh.length > 0 && zh == qrzh){
				return true;
			}else if(zh.length > 0 && zh != qrzh){
				alert("帐号、确认帐号录入不一致，请重新录入！！") ;
				return false;
			}
			
			if(khbh.length > 0 && khbh == qrkhbh){
				return true;
			}else if(khbh.length > 0 && khbh != qrkhbh){
				alert("客户编号、确认客户编号录入不一致，请重新录入！！") ;
				return false;
			}
		},
		//建行：全局跟踪流水号
		jylsh:function (){
			var _this = this;
			$.pdialog.open(ctxPath + "/zzspp/jylshDlg.do?lshString=" + lshString,"zzspp_jylsh_dlg","请输入交易流水",{
				width:722,
				height:415,
				callback:function(){
					limit_money_input($_("#jyje1,#jyje2,#jyje3,#jyje4,#jyje5,#jyje6,#jyje7,#jyje8,#jyje9,#jyje10," +
							"#jyje11,#jyje12,#jyje13,#jyje14,#jyje15,#jyje16,#jyje17,#jyje18,#jyje19,#jyje20")) ;
					$("#dlg_next_bt").click(function(){
						if(_this.jyYylsh()==""){
							return;
						}
						ajaxLoad(ctxPath+"/zzspp/jylsh.do",{lshString:lshString},function(json){
							if(json.re!=""){
								alert("第"+json.re+"行交易流水信息重复，请检查！");
								return;
							}
							$.pdialog.closeCurrent();
						});
					});
				}
			});
		},
		//校验全局跟踪流水号
		jyYylsh: function(){
			lshString = "" ;
			for(var i=1;i<=20;i++){
				var jylsh = $("#jylsh"+i).val();
				var jyrq = $("#jyrq"+i).val();
				var jyje = $("#jyje"+i).val().replaceAll(",", "");
				if(jylsh=="" && jyrq=="" && jyje==""){
					continue;
				}
				if(jylsh =="" || jyrq == "" || jyje ==""){
					alert("第"+i+"行交易流水信息不全，请检查并补全信息！") ;
					return "";
				}
				lshString =lshString + jylsh + "," + jyrq + "," + jyje + "," ;
			}
			lshString = qj2bj(lshString) ;
			if(lshString==""){
				alert("请输入交易流水信息！") ;
				return "";
			}
			return lshString;
		},
		
		//建行：全局跟踪流水号
//		setJylsh: function(lsh){
//			lshString = lsh;
//		},
		//打开费用明细导入弹框
		openFyxmdrDlg:function (){
			$.pdialog.open(ctxPath+"/readExcel/initUpload.do?fplxdm="+"004","fyxm_upload_dlg","费用明细导入",{
				width:400,
				height:180
			});
		},
		//费用项目导入
		fyxmdr:function(json){
			dialogAjaxDone(json);
			if(json.fyxm){
				zzp_fpkj.setValueFromExcel(json.fyxm);
			}else{
				alert("没有找到符合条件的数据！");
				return;
			}
		},
		//导入费用项目
		setValueFromExcel : function(yfp){
			var _this = this;
			if(yfp=="" || yfp==null || yfp=="null"){
				alert("没有符合开票条件的数据！");
				return;
			}
			//删除当前存在的子项
			var rowLen = maxRowIndex;
			for(var i=1;i<=rowLen;i++){
				_this.delRow();
			}
			//子表
			var mxzb = yfp.mxzb;
			var slOkFlag = true;
			var slErrorRow = "";
			for(var i=1;i<=mxzb.length;i++){
				_this.addRow();
				_$("#spmc_"+i).val(mxzb[i-1].spmc);
				_$("#ggxh_"+i).val(mxzb[i-1].ggxh);
				_$("#dw_"+i).val(mxzb[i-1].dw);
				_$("#spsl_"+i).val(mxzb[i-1].spsl?delRight(mxzb[i-1].spsl.toFixed(6)):"");
				_$("#spdj_"+i).val(mxzb[i-1].spdj?delRight(mxzb[i-1].spdj.toFixed(6)):"");
				_$("#je_"+i).val(mxzb[i-1].je?mxzb[i-1].je.toFixed(2):(_$("#spsl_"+i).val()*1*_$("#spdj_"+i).val()).toFixed(2));
				if(mxzb[i-1].sl+""==""||mxzb[i-1].sl==null || _this.szsmStr.indexOf(mxzb[i-1].sl, 0)<0){
					slOkFlag = false;
					slErrorRow = slErrorRow + i + "、";
				}
				_$("#sl_"+i).val(mxzb[i-1].sl?mxzb[i-1].sl.toFixed(2):"0");
				_$("#se_"+i).val(mxzb[i-1].se?mxzb[i-1].se.toFixed(2):(_$("#je_"+i).val()*1*_$("#sl_"+i).val()).toFixed(2));
			}
			disableButtons(_$("#fs"));
			this.reCountHjje();
			if(slOkFlag==false){
				alert("您所使用的数据中第"+slErrorRow.substring(0,slErrorRow.length-1)+"行税率有误或者没有在税局发行，不可开具发票，请检查！");
				disableButtons(_$("#xz,#sc,#zk,#jg,#qd,#kj,#fyxm"));
				return;
			}
		},
		initbjFromCookie:function (){
			var _this = this;
			$.pdialog.open(ctxPath+"/zzp/tzbj.do","zzp_tzbj_dlg","调整边距",{
				width:480,
				height:200,
				callback:function(){
					$("#dlg_print_bt").bind("click",_this.printfp);
					$("#dlg_printA_bt").bind("click",_this.printfpA);
					var zbj = $.cookie("zbj_zzsz");
					if(!zbj){
						zbj = defaultZbj;
					}
					var ybj = $.cookie("ybj_zzsz");
					if(!ybj){
						ybj = defaultYbj;
					}
					$("#zbj").val(zbj);
					$("#ybj").val(ybj);
				}
			});
		},
		printfp:function (){
			disableButtons(_$("#dy,#yl"));
			zzp_fpkj.initPrintData();
			$.cookie("dyfs")=="1"?LODOP.PRINTA():LODOP.PRINT();
		},
		initYLData:function (){
			zzp_fpkj.initPrintData(true);
			LODOP.SET_PREVIEW_WINDOW(1,0,0,890,700,"");
			LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW",1);
			LODOP.PREVIEW();
		},
		initPrintData:function (yl){
			LODOP.PRINT_INITA((yl?defaultZbj:$.cookie("zbj_zzsz")||0)+"mm",(yl?defaultYbj:$.cookie("ybj_zzsz")||0)+"mm","230mm","159mm","增值税专用发票");
			LODOP.SET_PRINT_PAGESIZE(1,2300,1590,"CreateCustomPage");
			var fpmxPrint = $.extend({fplxdm:"004"},fpmx,{
				jshjdx:je2Upper(fpmx.jshj),
				ewm:fpmx.ewm,
				mxzb:filterMxzbPrint(fpmx)
			});
			printZzszp(fpmxPrint);
		},
		initPage:function(){
			maxRowIndex = 0,nowRowIndex = 0,maxZkRow = 0;
			fskj = false;
			qdbz = false;
			w1=15,w2=165,w3=80,w4=50,w5=80,w6=100,w7=122,w8=60,w9=90;
			hsbz=false;
			defaultZbj = 6,defaultYbj = -6;
			zhsl = "";
			xxbbh = "",tzdh = "",yfpdm = "",yfphm = "";
			fpmx = {},blxx="";
			zh = "",lshString="";
			if(ie6){
				w2=171;
				w7=122;
				w9=83;
			}
			var _this = this;
			for (var index = 1; index <= 8; index++) {
			 	_$("#fyxms").append(_this.newPlaceHolder());
			}
			ajaxLoad(ctxPath+"/zzp/check.do",{async:false},function(json){
				enableButtons(_$("#xz,#jg,#qd,#kj,#fs,#cxgfxx,#jylsh,#fyxm,#fyxmmb,#fyxmdrsm"));
				_$("#fpdm").text(json.dqph.dqfpdm);
				_$("#fphm").text(json.dqph.dqfphm);
				_$("#kprq").text(json.kprq);
				_this.szsmStr = genSzsm(json.szsm.group);
				blxx = json.blxx;
				if(blxx!="" && blxx!=null && blxx.substring(4,6)=="08"){
					_this.szsmStr = "<option value='0.015'>1.5%</option><option value='0.03'>3%</option><option value='0.05'>5%</option>";
				}
			})
			//查询购方信息
			_$("#cxgfxx").click(function(){
				_this.cxgfxx();
			})
			//全局跟踪流水号
			_$("#jylsh").click(function(){
				_this.jylsh();
			})
			//添加行
			_$("#xz").click(function(){
				_this.addRow();
			})
			//删除行
			_$("#sc").click(function(e){
				_this.delRow();
			});
			//折扣
			_$("#zk").click(function(){
				_this.addZk();
			})
			//价格
			_$("#jg").click(function(){
				_this.toggleSfhs();
			}).click();
			//清单
			_$("#qd").click(function(){
				_this.toggleSyqd();
			})
			//开具
			_$("#kj").click(function(){
				if(!checkPrint()){
					return;
				}
				if(!checkKey()){
					return;
				}
				var valid = _this.validateZsfp();
				if(valid){
					//单价数量是否超13位校验
					if(!_this.djslJy()){
						return;
					}
					if(sk_version=='CBC' && !fskj){
						//判断全局跟踪流水号是否填写，如果不填写，添加确认选择框，让开票员选择是否开票
						if(lshString == null || lshString == ""){
							
							//控制，不输入交易流水信息不能开票
							alertMsg.error("请输入交易流水信息！");
							return ;
							
//							alertMsg.confirm("您尚未输入交易流水，为避免发票重开风险，请确认是否继续开具发票？", {
//								okCall: function(){
//									checkPerm(function(){
//										_this.addExtraInfo();
//										_$("#zzp_fpkj_form").submit();
//									});					
//								}
//							});
						}else{
							zzspp_fpkj.judRepJylsh(lshString, _$("#ghdwdm").val(), function(){
								checkPerm(function(){
									_this.addExtraInfo();
									_$("#zzp_fpkj_form").submit();
								});
							});
						}
					}else{
						checkPerm(function(){
							_this.addExtraInfo();
							_$("#zzp_fpkj_form").submit();
						});
					}
					
				}
			})
			//负数
			_$("#fs").click(function(){
				_this.openFskjDlg();
			})
			//费用明细导入
			_$("#fyxm").click(function(){
				_this.openFyxmdrDlg();
			})
			//费用明细模板下载
			_$("#fyxmmb").click(function(){
				window.open(ctxPath+"/resources/download/fymxmb.xlsx");
			})
			//导入说明
			_$("#fyxmdrsm").click(function(){
				alert("1、货物或应税劳务名称不能为空，最多为72个字符或36个汉字；\n2、规格型号最多为36个字符或18个汉字；\n3、单位最多为14个字符或7个汉字；\n4、金额、税率不能为空。");
			})
			//预览
			_$("#yl").click(function(){
				_this.initYLData();
			})
			//打印
			_$("#dy").click(function(){
				_this.printfp();
			})
			//下一张
			_$("#xyz").click(function(){
				lshString = "" ;
				navTab.reload(null,{
					data:{
						ghdwmc:_$("#ghdwmc").val(),
						ghdwdm:_$("#ghdwdm").val(),
						ghdwdzdh:_$("#ghdwdzdh").val(),
						ghdwyhzh:_$("#ghdwyhzh").val()
					}
				})
			})
		}
	}
}();