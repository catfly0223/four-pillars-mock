/**
 * 四柱推命の命式を計算するためのユーティリティモジュール
 */
import * as kd from '../data/kanshiData.js';

/**
 * 四柱推命の命式を計算するクラス
 * 参考リポジトリから移植して実装
 */
export class MeishikiCalculator {
    constructor(birthday, sex) {
        this.birthday = new Date(birthday);
        this.sex = sex; // 0: 男性, 1: 女性
        this.meishiki = {};
        this.hasTime = birthday.includes('T') || birthday.includes(' ');
    }

    /**
     * 節入り判定（指定月の節入り日時を超えているか）
     * @param {Date} date
     * @param {number} month
     * @returns {number} 0: 節入りしている, -1: していない
     */
    isSetsuiri(date, month) {
        for (const s of kd.setsuiri) {
            if (s[0] === date.getFullYear() && s[1] === month) {
                const setsuiri = new Date(s[0], s[1] - 1, s[2], s[3], s[4]);
                if (setsuiri < date) {
                    return 0; // 節入りしている
                }
                return -1; // していない
            }
        }
        throw new Error('節入りを判定できませんでした。');
    }

    /**
     * 年干支を計算（節入り考慮）
     * @returns {[number, number]} [年干, 年支]
     */
    findYearKanshi() {
        const date = this.birthday;
        // 節入り判定（2月）
        const offset = this.isSetsuiri(date, 2);
        // Python: (year - 3) % 60 - 1 + offset
        const idx = ((date.getFullYear() - 3) % 60) - 1 + offset;
        if (idx < 0 || idx >= kd.sixtyKanshi.length) throw new Error('年干支の計算で例外');
        return kd.sixtyKanshi[idx];
    }

    /**
     * 月干支を計算（節入り考慮）
     * @param {number} yKan 年干
     * @returns {[number, number]} [月干, 月支]
     */
    findMonthKanshi(yKan) {
        const date = this.birthday;
        // 節入り判定（当月）
        const offset = this.isSetsuiri(date, date.getMonth() + 1);
        // Python: month = birthday.month - 1 + offset
        const monthIdx = date.getMonth() + offset;
        if (monthIdx < 0 || monthIdx > 11) throw new Error('月干支の計算で例外');
        const [mKan, mShi] = kd.monthKanshi[yKan][monthIdx];
        return [mKan, mShi];
    }

    /**
     * 日干支を計算（kisu_table利用、1926年以降のみ対応）
     * @returns {[number, number]} [日干, 日支]
     */
    findDayKanshi() {
        const date = this.birthday;
        const yearIdx = date.getFullYear() - 1926;
        if (yearIdx < 0 || yearIdx >= kd.kisuTable.length) throw new Error('生年は1926年以降のみ対応');
        const monthIdx = date.getMonth();
        let d = date.getDate() + kd.kisuTable[yearIdx][monthIdx] - 1;
        if (d >= 60) d -= 60;
        if (d < 0 || d >= kd.sixtyKanshi.length) throw new Error('日干支の計算で例外');
        return kd.sixtyKanshi[d];
    }

    /**
     * 時干支を計算（Pythonのtime_spanロジックを反映）
     * @param {number} dKan 日干
     * @returns {[number, number]} [時干, 時支]
     */
    findTimeKanshi(dKan) {
        const date = this.birthday;
        const hour = date.getHours();
        // Python: time_span = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24]
        const timeSpan = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24];
        let idx = -1;
        for (let i = 0; i < timeSpan.length - 1; i++) {
            const from = timeSpan[i];
            const to = timeSpan[i + 1];
            if ((hour >= from && hour < to) || (i === 0 && hour === 0)) {
                idx = i;
                break;
            }
        }
        if (idx === -1) throw new Error('時干支の計算で例外');
        const [tKan, tShi] = kd.timeKanshi[dKan][idx];
        return [tKan, tShi];
    }

    /**
     * 蔵干を取得（完全版: 節入り・zokan_time考慮）
     * @param {number} shi
     * @returns {number}
     */
    findZokan(shi) {
        if (shi === -1) return -1;
        const birthday = this.birthday;
        // 直近の節入り日時を取得
        let setsuiriDate = null;
        let p = this.isSetsuiri(birthday, birthday.getMonth() + 1);
        for (const s of kd.setsuiri) {
            if (s[0] === birthday.getFullYear() && s[1] === birthday.getMonth() + 1) {
                let y, m;
                if (s[1] + p <= 0) {
                    y = s[0] - 1;
                    m = 12;
                } else {
                    y = s[0];
                    m = s[1] + p;
                }
                setsuiriDate = new Date(y, m - 1, s[2], s[3], s[4]);
                break;
            }
        }
        if (!setsuiriDate) throw new Error('節入り日時が取得できませんでした');
        // 午の場合
        if (shi === 6) {
            const delta1 = kd.zokan_time[6][0]; // [日, 時]
            const delta2 = kd.zokan_time[6][1];
            const setsuiri1 = new Date(setsuiriDate.getTime() + delta1[0] * 86400000 + delta1[1] * 3600000);
            const setsuiri2 = new Date(setsuiriDate.getTime() + delta2[0] * 86400000 + delta2[1] * 3600000);
            if (birthday <= setsuiri1) {
                return kd.zokan[6][0];
            } else if (birthday > setsuiri1 && birthday <= setsuiri2) {
                return kd.zokan[6][1];
            } else {
                return kd.zokan[6][2];
            }
        } else {
            const delta = kd.zokanTime[shi]; // [日, 時]
            const setsuiriX = new Date(setsuiriDate.getTime() + delta[0] * 86400000 + delta[1] * 3600000);
            if (birthday <= setsuiriX) {
                return kd.zokan[shi][0];
            } else {
                return kd.zokan[shi][1];
            }
        }
    }

    /**
     * 月令を得る
     * @param {number} dKan 日干
     * @param {number} mShi 月支
     * @returns {number} 0:得ず, 1:旺ず, 2:相す
     */
    getGetsurei(dKan, mShi) {
        if (kd.getsureiOu[dKan].includes(mShi)) return 1;
        if (kd.getsureiSou[dKan].includes(mShi)) return 2;
        return 0;
    }

    /**
     * 通変を得る
     * @param {Array} tenkan
     * @param {Array} zokan
     * @returns {Array}
     */
    getTsuhen(tenkan, zokan) {
        const std = tenkan[2]; // 日干
        return [...tenkan, ...zokan].map(i => (i === -1 ? -1 : kd.kanTsuhen[std][i]));
    }

    /**
     * 十二運を得る
     * @param {Array} tenkan
     * @param {Array} chishi
     * @returns {Array}
     */
    getTwelveFortune(tenkan, chishi) {
        const std = tenkan[2]; // 日干
        return chishi.map(c => (c === -1 ? -1 : kd.twelveTable[std][c]));
    }

    /**
     * 干合
     */
    getKango(tenkanZokan) {
        const kango = [];
        for (let i = 0; i < tenkanZokan.length; i++) {
            const tz1 = tenkanZokan[i];
            if (tz1 === -1) continue;
            for (let j = i + 1; j < tenkanZokan.length; j++) {
                if (kd.kango[tz1] === tenkanZokan[j]) {
                    kango.push([[tz1, i], [tenkanZokan[j], j], kd.kangoHenka[tz1]]);
                }
            }
        }
        return kango;
    }

    /**
     * 支合
     */
    getShigo(chishi) {
        const shigo = [];
        for (let i = 0; i < chishi.length; i++) {
            const s = chishi[i];
            if (s === -1) continue;
            for (let j = i + 1; j < chishi.length; j++) {
                if (kd.shigo[s] === chishi[j]) {
                    shigo.push([[s, i], [kd.shigo[s], j]]);
                }
            }
        }
        return shigo;
    }

    /**
     * 方合
     */
    getHogo(chishi) {
        for (let i = 0; i < kd.hogo.length; i++) {
            const h = kd.hogo[i][0];
            if (chishi.includes(h[0]) && chishi.includes(h[1]) && chishi.includes(h[2])) {
                return kd.hogo[i];
            }
        }
        return [];
    }

    /**
     * 三合
     */
    getSango(chishi) {
        for (let i = 0; i < kd.sango.length; i++) {
            const s = kd.sango[i][0];
            if (chishi.includes(s[0]) && chishi.includes(s[1]) && chishi.includes(s[2])) {
                return kd.sango[i];
            }
        }
        return [];
    }

    /**
     * 半会
     */
    getHankai(chishi) {
        const hankai = [];
        for (let i = 0; i < kd.hankai.length; i++) {
            const h = kd.hankai[i][0];
            if (chishi.includes(h[0]) && chishi.includes(h[1])) {
                hankai.push(kd.hankai[i]);
            }
        }
        return hankai;
    }

    /**
     * 七冲
     */
    getHitsuchu(chishi) {
        const hitsuchu = [];
        for (let i = 0; i < chishi.length; i++) {
            const s = chishi[i];
            if (s === -1) continue;
            for (let j = i + 1; j < chishi.length; j++) {
                if (kd.hitsuchu[s] === chishi[j]) {
                    hitsuchu.push([[s, i], [kd.hitsuchu[s], j]]);
                }
            }
        }
        return hitsuchu;
    }

    /**
     * 刑
     */
    getKei(chishi) {
        const kei = [];
        for (let i = 0; i < chishi.length; i++) {
            const s = chishi[i];
            if (s === -1) continue;
            for (let j = 0; j < chishi.length; j++) {
                if (i !== j && kd.kei[s] === chishi[j]) {
                    kei.push([[s, i], [kd.kei[s], j]]);
                }
            }
        }
        return kei;
    }

    /**
     * 害
     */
    getGai(chishi) {
        const gai = [];
        for (let i = 0; i < chishi.length; i++) {
            const s = chishi[i];
            if (s === -1) continue;
            for (let j = i + 1; j < chishi.length; j++) {
                if (kd.gai[s] === chishi[j]) {
                    gai.push([[s, i], [kd.gai[s], j]]);
                }
            }
        }
        return gai;
    }

    /**
     * 調候
     */
    getChoko(date, dKan) {
        return kd.choko[dKan][date.getMonth()];
    }

    /**
     * 空亡
     */
    getKubo(date) {
        const yearIdx = date.getFullYear() - 1926;
        if (yearIdx < 0 || yearIdx >= kd.kisuTable.length) return [];
        const monthIdx = date.getMonth();
        let d = date.getDate() + kd.kisuTable[yearIdx][monthIdx] - 1;
        if (d >= 60) d -= 60;
        return kd.kubo[Math.floor(d / 10)];
    }

    /**
     * 陽刃
     */
    getYoujin(dKan, dShi) {
        if ((dKan === 2 && dShi === 6) || (dKan === 4 && dShi === 6) || (dKan === 8 && dShi === 0)) return 1;
        return 0;
    }

    /**
     * 魁罡
     */
    getKaigou(dKan, dShi) {
        if ((dKan === 4 && dShi === 10) || (dKan === 6 && dShi === 10) || (dKan === 6 && dShi === 4) || (dKan === 8 && dShi === 4)) return 1;
        return 0;
    }

    /**
     * 命式を構築する
     * @returns {Object} 命式データ
     */
    buildMeishiki() {
        // 天干・地支を得る
        const [yKan, yShi] = this.findYearKanshi();
        const [mKan, mShi] = this.findMonthKanshi(yKan);
        const [dKan, dShi] = this.findDayKanshi();
        let tKan = -1;
        let tShi = -1;
        if (this.hasTime) {
            [tKan, tShi] = this.findTimeKanshi(dKan);
        }
        const tenkan = [yKan, mKan, dKan, tKan];
        const chishi = [yShi, mShi, dShi, tShi];
        // 蔵干を得る
        const yZkan = this.findZokan(yShi);
        const mZkan = this.findZokan(mShi);
        const dZkan = this.findZokan(dShi);
        let tZkan = -1;
        if (this.hasTime) {
            tZkan = this.findZokan(tShi);
        }
        const zokan = [yZkan, mZkan, dZkan, tZkan];
        // 四柱を得る
        const nenchu = [yKan, yShi, yZkan];
        const getchu = [mKan, mShi, mZkan];
        const nitchu = [dKan, dShi, dZkan];
        const jichu = [tKan, tShi, tZkan];
        const nikkan = dKan;
        // 五行（木火土金水）のそれぞれの数を得る
        const gogyo = [0, 0, 0, 0, 0];
        for (const t of tenkan) {
            if (t !== -1) {
                gogyo[kd.gogyoKan[t]] += 1;
            }
        }
        for (const s of chishi) {
            if (s !== -1) {
                gogyo[kd.gogyoShi[s]] += 1;
            }
        }
        // 陰陽のそれぞれの数を得る
        const inyo = [0, 0];
        for (const t of tenkan) {
            if (t !== -1) {
                inyo[t % 2] += 1;
            }
        }
        for (const s of chishi) {
            if (s !== -1) {
                inyo[s % 2] += 1;
            }
        }
        // 月令
        const getsurei = this.getGetsurei(dKan, mShi);
        // 通変
        const tsuhen = this.getTsuhen(tenkan, zokan);
        // 十二運
        const twelveFortune = this.getTwelveFortune(tenkan, chishi);
        // 干合
        const kango = this.getKango([...tenkan, ...zokan]);
        // 支合
        const shigo = this.getShigo(chishi);
        // 方合
        const hogo = this.getHogo(chishi);
        // 三合
        const sango = this.getSango(chishi);
        // 半会
        const hankai = this.getHankai(chishi);
        // 七冲
        const hitsuchu = this.getHitsuchu(chishi);
        // 刑
        const kei = this.getKei(chishi);
        // 害
        const gai = this.getGai(chishi);
        // 調候
        const choko = this.getChoko(this.birthday, dKan);
        // 空亡
        const kubo = this.getKubo(this.birthday);
        // 陽刃
        const youjin = this.getYoujin(dKan, dShi);
        // 魁罡
        const kaigou = this.getKaigou(dKan, dShi);
        // 命式のオブジェクトに情報を追加
        this.meishiki = {
            tenkan,
            chishi,
            zokan,
            nenchu,
            getchu,
            nitchu,
            jichu,
            nikkan,
            gogyo,
            inyo,
            getsurei,
            tsuhen,
            twelveFortune,
            kango,
            shigo,
            hogo,
            sango,
            hankai,
            hitsuchu,
            kei,
            gai,
            choko,
            kubo,
            youjin,
            kaigou
        };
        return this.meishiki;
    }
}

/**
 * 命式を作成する
 * @param {String} birthday 生年月日
 * @param {Number} sex 性別（0: 男性, 1: 女性）
 * @returns {Object} 命式データ
 */
export function calculateMeishiki(birthday, sex) {
    const calculator = new MeishikiCalculator(birthday, sex);
    return calculator.buildMeishiki();
} 