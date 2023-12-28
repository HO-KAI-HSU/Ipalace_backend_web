/* eslint-disable no-undef */
import $ from 'jquery';
import qs from 'qs';
import user from '../plugins/user'

import $axios from 'axios';

let token = user.user ? user.user.t : null;
var enableBlockUI = true;

export default {
    setToken(t) {
        token = t;
    },
    setEnableBlockUI(value) {
        enableBlockUI = value;
    },
    getUrl(url) {
        if (token) {
            if (url.indexOf('?') > 0) {
                url += '&t=' + encodeURIComponent(token);
            } else {
                url += '?t=' + encodeURIComponent(token);
            }
        }
        return config.host + url;
    },

    handle(p) {
        return new Promise((resolve, reject) => {
            if (enableBlockUI && window.blockUI) {
                window.blockUI();
            }
            p.then(res => {
                var data = res.data;
                if (data.Success) {
                    resolve(data.Result);
                } else {
                    reject(res)
                }
                window.unblockUI();
            })
                .catch((err) => {
                    console.log(err);
                    /*if (err.status == 410) {
                        this.raiseOnExpire();
                        return;
                    }*/
                    window.unblockUI();
                    reject(err)
                });
        });
    },

    downloadFile(fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(content, fileName);
        } else {
            var aLink = document.createElement('a');
            var blob = new Blob([content], { type: 'text/csv' });
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt); 
            aLink.id = "alink";
            aLink.click(); 
        }
    },


    async getCsv(endpoint) {
        const { data } = await $axios.get(this.getUrl(endpoint));
        return data;
    },

    get(url, data) {
        if (!data) {
            return this.handle($axios.get(this.getUrl(url)));
        } else {
            return this.handle($axios.get(this.getUrl(url) + qs.stringify(url)));
        }
    },
    post(url, data, config) {
        return this.handle($axios.post(this.getUrl(url), data, config));
    },
    multipartPost(url, data) {
        url = this.getUrl(url);
        var fdata = new FormData();
        for (var key in data) {
            fdata.append(key, data[key]);
        }
        return $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            processData: false,
            data: fdata
        });
    },
    put(url, data) {
        return this.handle($axios.put(this.getUrl(url), data));
    },
    putStatus(url) {
        return this.handle($axios.post(this.getUrl(url)));
    },
    delete(url) {
        return this.handle($axios.delete(this.getUrl(url)));
    },
    hasToken() {
        return token != null && token != undefined && token != "";
    },

    getAccounts() {
        return this.get('/api/backend/GetAccounts');
    },

    getAccount(id) {
        return this.get('/api/backend/GetAccount/' + id);
    },

    createAccount(data) {
        return this.post('/api/backend/CreateAccount', data);
    },

    updateAccount(id, data) {
        return this.put('/api/backend/UpdateAccount/' + id, data);
    },

    deleteAccount(id) {
        return this.delete('/api/backend/DeleteAccount/' + id);
    },

    getRoles() {
        return this.get('/api/backend/GetRoles');
    },

    getRole(id) {
        return this.get('/api/backend/GetRole/' + id);
    },

    createRole(data) {
        return this.post('/api/backend/CreateRole', data);
    },

    updateRole(id, data) {
        return this.put('/api/backend/UpdateRole/' + id, data);
    },

    deleteRole(id) {
        return this.delete('/api/backend/DeleteRole/' + id);
    },

    getTechPlanCategories() {
        return this.get('/api/backend/GetTeachPlanCategories');
    },
    getTechPlans() {
        return this.get('/api/backend/GetTeachPlans');
    },
    getTechPlan(id) {
        return this.get('/api/backend/GetTeachPlan/' + id);
    },
    addTechPlan(data) {
        return this.post('/api/backend/CreateTeachPlan', data);
    },
    updateTechPlan(data) {
        return this.post('/api/backend/UpdateTeachPlan', data);
    },
    deleteTechPlan(id) {
        return this.delete('/api/backend/DeleteTeachPlan/' + id);
    },
    updateTechPlanPublishStatus(id) {
        return this.putStatus('/api/backend/UpdateTeachPlanPublishStatus/' + id);
    },
    removeNews(id) {
        return this.delete('/api/backend/news/' + id);
    },
    getCancelToken() {
        return $axios.CancelToken.source();
    },
    upload(url, file, cancel, uploadProgressCallback) {
        var data = new FormData();
        data.append('file', file);
        var token = null;
        if (cancel) {
            token = cancel.token;
        }
        return this.post(url, data, {
            cancelToken: token,
            onUploadProgress(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    if (uploadProgressCallback) {
                        uploadProgressCallback((percentComplete * 100.0).toFixed(2));
                    }
                }
            }
        });
    },
    getLessonCategories() {
        return this.get('/api/backend/GetLessonCategories');
    },
    getLessons() {
        return this.get('/api/backend/GetLessons');
    },
    getLesson(id) {
        return this.get('/api/backend/GetLesson/' + id);
    },
    addLesson(data) {
        return this.post('/api/backend/CreateLesson', data);
    },
    updateLesson(data) {
        return this.post('/api/backend/UpdateLesson', data);
    },
    deleteLesson(id) {
        return this.delete('/api/backend/DeleteLesson/' + id);
    },
    updateLessonPublishStatus(id) {
        return this.putStatus('/api/backend/UpdateLessonPublishStatus/' + id);
    },
    getBanners() {
        return this.get('/api/backend/GetBanners');
    },
    createBanner(data) {
        return this.post('/api/backend/CreateBanner', data);
    },
    updateBanner(data) {
        return this.post('/api/backend/UpdateBanner', data);
    },
    delBanner(id) {
        return this.del('/api/backend/DeleteBanner/' + id);
    },
    updateBannerSort(data) {
        return this.post('/api/backend/UpdateBannerSort', data);
    },
    getCss() {
        return this.get('/api/backend/GetCss');
    },
    updateCss(data) {
        return this.post('/api/backend/UpdateCss', data);
    },
    getSetting(){
        return this.get('/api/backend/GetSetting');
    },
    updateSetting(data) {
        return this.post('/api/backend/UpdateSetting', data);
    },
    getMembers(){
        return this.get('/api/backend/GetMembers');
    },
    getMember(id) {
        return this.get('/api/backend/GetMember/' + id);
    },
    updateMember(data) {
        return this.post('/api/backend/UpdateMember', data);
    },
    updateMemberPassword(data) {
        return this.post('/api/backend/UpdateMemberPassword', data);
    },
    getLessonStatistics(startDate, endDate) {
        return this.get('/api/backend/GetLessonStatisticList?' + 'startDate=' + startDate + '&endDate=' + endDate);
    },
    getTeachPlanStatistics(startDate, endDate) {
        return this.get('/api/backend/GetTeachPlanStatisticList?' + 'startDate=' + startDate + '&endDate=' + endDate);
    },
    getMemberLessonStatistics(startDate, endDate, sortBy) {
        return this.get('/api/backend/GetMemberLessonStatisticList?' + 'startDate=' + startDate + '&endDate=' + endDate+ '&sortBy=' + sortBy);
    },
    getMemberTeachPlanStatistics(startDate, endDate) {
        return this.get('/api/backend/GetMemberTeachPlanStatisticList?' + 'startDate=' + startDate + '&endDate=' + endDate);
    },
    getMemberRegisterStatistics(startDate, endDate, dateType) {
        return this.get('/api/backend/GetMemberRegisterStatisticList?' + 'startDate=' + startDate + '&endDate=' + endDate + '&dateType=' + dateType);
    },
    getMemberRegisterCounts(startDate, endDate, dateType) {
        return this.get('/api/backend/GetMemberRegisterTotalCountsByDate?' + 'startDate=' + startDate + '&endDate=' + endDate + '&dateType=' + dateType);
    }
}