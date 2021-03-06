/**
 * Created by pgh on 2017/12/13.
 */
var escfpcx_tbsk = function () {
    var cache, fpmx, defaultZbj, defaultYbj;
    return {
        initPage: function () {
            cache = {}, fpmx = null, defaultZbj = 6, defaultYbj = -6,
                disableButtons(_$("#ck"));
            disableButtons(_$("#tbzt"));
        },
        preview: function () {
            if (!checkPrint()) {
                return;
            }
            this.initYLData();
        },
        qhzt: function () {
            enableButtons(_$("#ck"));
            enableButtons(_$("#tbzt"));
            var fpxxJson = _$(".pageContent table tr td").children(":last")
                .children("span").text();
            fpmx = $.parseJSON(fpxxJson);
        },
        tb: function () {
            _$("#jqbh").val(fpmx.jqbh);
            _$("#qmbz").val(fpmx.qmbz);
            _$("#scbz").val(fpmx.scbz);
            _$("#yqbz").val(fpmx.yqbz);
            _$("#fpzt").val(fpmx.fpzt);
            _$("#zfrq").val(fpmx.zfrq);
            ajaxLoad(ctxPath + "/fpcxtbsk/tb.do", _$("#escfpcxtb_form").serialize(), function (json) {
                alertMsg.correct(json.message);
            })

        },

        initYLData: function () {
            this.initPrintDataescp(true);
            LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 850, 750, "");
            LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW", 1);
            LODOP.PREVIEW();
        },
        initPrintDataescp: function (yl) {
            var fpmxPrint = $.extend({fplxdm: "006"}, fpmx, {
                ewm: fpmx.qmz
            });
            printEscfp(fpmxPrint, true);
        }
    }
}();