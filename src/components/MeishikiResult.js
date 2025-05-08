/**
 * 命式の結果を表示するコンポーネント
 */
import * as kd from '../data/kanshiData.js';

export class MeishikiResult {
    constructor(container) {
        this.container = container;
        console.log('MeishikiResult component initialized');
    }
    
    /**
     * 命式を表示する
     * @param {Object} meishiki 命式データ
     * @param {Object} formData フォームデータ
     */
    render(meishiki, formData) {
        console.log('Rendering meishiki data:', meishiki);
        const { birthday, sex } = formData;
        const birthdayDate = new Date(birthday);
        const formattedDate = this.formatDate(birthdayDate);
        const sexText = sex === 0 ? '男性' : '女性';
        
        // 命式データから必要な情報を取得
        const { tenkan, chishi, zokan, tsuhen, gogyo, inyo, kango, shigo, hitsuchu, kei } = meishiki;
        
        // 天干・地支・蔵干の文字に変換
        const tenkanStr = tenkan.map(k => k !== -1 ? kd.kan[k] : '-');
        const chishiStr = chishi.map(s => s !== -1 ? kd.shi[s] : '-');
        const zokanStr = zokan.map(z => z !== -1 ? kd.kan[z] : '-');
        const tsuhenStr = tsuhen ? tsuhen.map(t => t !== -1 ? kd.tsuhen[t] : '-') : Array(8).fill('-');
        const twelveFortuneStr = meishiki.twelveFortune ? meishiki.twelveFortune.map(t => t !== -1 ? kd.twelveFortune[t] : '-') : Array(4).fill('-');
        
        // 四柱の列名
        const columNames = ['生年', '生月', '生日', '生時'];
        
        this.container.innerHTML = `
            <div class="result-header">
                <h2>四柱推命 鑑定結果</h2>
                <p>生年月日: ${formattedDate} / 性別: ${sexText}</p>
            </div>
            
            <div class="meishiki-container">
                <h3>命式（八字）</h3>
                <table class="meishiki-table">
                    <thead>
                        <tr>
                            <th></th>
                            ${columNames.map(name => `<th>${name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>天干</td>
                            ${tenkanStr.map((k, i) => `<td>${k}${tsuhenStr[i] !== '-' ? `<br>(${tsuhenStr[i]})` : ''}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>地支</td>
                            ${chishiStr.map(s => `<td>${s}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>蔵干</td>
                            ${zokanStr.map((z, i) => `<td>${z}${tsuhenStr[i+4] !== '-' ? `<br>(${tsuhenStr[i+4]})` : ''}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>十二運</td>
                            ${twelveFortuneStr.map(t => `<td>${t}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="info-section">
                <h3>五行の分布</h3>
                <div class="gogyo-container">
                    ${kd.gogyo.map((g, i) => `
                        <div class="gogyo-item">
                            <span class="gogyo-name">${g}</span>
                            <span class="gogyo-count">${gogyo[i]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="info-section">
                <h3>陰陽のバランス</h3>
                <div class="inyo-container">
                    <div class="inyo-item">
                        <span class="inyo-name">陽</span>
                        <span class="inyo-count">${inyo[0]}</span>
                    </div>
                    <div class="inyo-item">
                        <span class="inyo-name">陰</span>
                        <span class="inyo-count">${inyo[1]}</span>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h3>干合</h3>
                ${this.renderKango(kango)}
            </div>
            
            <div class="info-section">
                <h3>支合</h3>
                ${this.renderShigo(shigo)}
            </div>
            
            <div class="info-section">
                <h3>冲（対冲）</h3>
                ${this.renderHitsuchu(hitsuchu)}
            </div>
            
            <div class="info-section">
                <h3>刑</h3>
                ${this.renderKei(kei)}
            </div>
        `;
        
        // スタイルを適用する
        this.applyStyles();
    }
    
    /**
     * 干合の情報をレンダリングする
     * @param {Array} kango 干合情報
     */
    renderKango(kango) {
        if (!kango || kango.length === 0) {
            return '<p>干合なし</p>';
        }
        
        const locations = ['年柱天干', '月柱天干', '日柱天干', '時柱天干', '年柱蔵干', '月柱蔵干', '日柱蔵干', '時柱蔵干'];
        
        return `
            <ul>
                ${kango.map(k => {
                    const kan1 = kd.kan[k[0][0]];
                    const loc1 = locations[k[0][1]];
                    const kan2 = kd.kan[k[1][0]];
                    const loc2 = locations[k[1][1]];
                    return `<li>${loc1}の「${kan1}」と${loc2}の「${kan2}」が干合します。</li>`;
                }).join('')}
            </ul>
        `;
    }
    
    /**
     * 支合の情報をレンダリングする
     * @param {Array} shigo 支合情報
     */
    renderShigo(shigo) {
        if (!shigo || shigo.length === 0) {
            return '<p>支合なし</p>';
        }
        
        const locations = ['年柱地支', '月柱地支', '日柱地支', '時柱地支'];
        
        return `
            <ul>
                ${shigo.map(s => {
                    // 想定内の「該当なし」チェック
                    if (
                        s[0][0] === -1 || s[1][0] === -1 ||
                        s[0][0] === null || s[1][0] === null
                    ) {
                        return `<li>該当なし</li>`;
                    }
                    // 想定外の範囲外アクセス
                    if (
                        kd.shi[s[0][0]] === undefined || kd.shi[s[1][0]] === undefined
                    ) {
                        console.warn('想定外の地支インデックス:', s);
                        return `<li>データ不正: ${JSON.stringify(s)}</li>`;
                    }
                    const shi1 = kd.shi[s[0][0]];
                    const loc1 = locations[s[0][1]];
                    const shi2 = kd.shi[s[1][0]];
                    const loc2 = locations[s[1][1]];
                    return `<li>${loc1}の「${shi1}」と${loc2}の「${shi2}」が支合します。</li>`;
                }).join('')}
            </ul>
        `;
    }
    
    /**
     * 冲（対冲）の情報をレンダリングする
     * @param {Array} hitsuchu 冲情報
     */
    renderHitsuchu(hitsuchu) {
        if (!hitsuchu || hitsuchu.length === 0) {
            return '<p>冲なし</p>';
        }
        
        const locations = ['年柱地支', '月柱地支', '日柱地支', '時柱地支'];
        
        return `
            <ul>
                ${hitsuchu.map(h => {
                    // 想定内の「該当なし」チェック
                    if (
                        h[0][0] === -1 || h[1][0] === -1 ||
                        h[0][0] === null || h[1][0] === null
                    ) {
                        return `<li>該当なし</li>`;
                    }
                    // 想定外の範囲外アクセス
                    if (
                        kd.shi[h[0][0]] === undefined || kd.shi[h[1][0]] === undefined
                    ) {
                        console.warn('想定外の地支インデックス:', h);
                        return `<li>データ不正: ${JSON.stringify(h)}</li>`;
                    }
                    const shi1 = kd.shi[h[0][0]];
                    const loc1 = locations[h[0][1]];
                    const shi2 = kd.shi[h[1][0]];
                    const loc2 = locations[h[1][1]];
                    return `<li>${loc1}の「${shi1}」と${loc2}の「${shi2}」が対冲します。</li>`;
                }).join('')}
            </ul>
        `;
    }
    
    /**
     * 刑の情報をレンダリングする
     * @param {Array} kei 刑情報
     */
    renderKei(kei) {
        if (!kei || kei.length === 0) {
            return '<p>刑なし</p>';
        }
        
        const locations = ['年柱地支', '月柱地支', '日柱地支', '時柱地支'];
        
        return `
            <ul>
                ${kei.map(k => {
                    // 想定内の「該当なし」チェック
                    if (
                        k[0][0] === -1 || k[1][0] === -1 ||
                        k[0][0] === null || k[1][0] === null
                    ) {
                        return `<li>該当なし</li>`;
                    }
                    // 想定外の範囲外アクセス
                    if (
                        kd.shi[k[0][0]] === undefined || kd.shi[k[1][0]] === undefined
                    ) {
                        console.warn('想定外の地支インデックス:', k);
                        return `<li>データ不正: ${JSON.stringify(k)}</li>`;
                    }
                    const shi1 = kd.shi[k[0][0]];
                    const loc1 = locations[k[0][1]];
                    const shi2 = kd.shi[k[1][0]];
                    const loc2 = locations[k[1][1]];
                    return `<li>${loc1}の「${shi1}」が${loc2}の「${shi2}」を刑します。</li>`;
                }).join('')}
            </ul>
        `;
    }
    
    /**
     * 日付をフォーマットする
     * @param {Date} date 日付
     * @returns {String} フォーマットされた日付
     */
    formatDate(date) {
        const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        let result = `${year}年${month}月${day}日`;
        
        if (hasTime) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            result += ` ${hours}時${minutes}分`;
        }
        
        return result;
    }
    
    /**
     * 追加のスタイルを適用する
     */
    applyStyles() {
        console.log('Applying styles to components');
        // 五行の分布表示用のスタイル
        const gogyoContainer = this.container.querySelector('.gogyo-container');
        if (gogyoContainer) {
            console.log('Found gogyo container, applying styles');
            // CSSで基本スタイルを設定済みなので、ここでは五行ごとの色のみ設定
            const gogyoItems = gogyoContainer.querySelectorAll('.gogyo-item');
            
            // 五行ごとの色を設定（CSSの変数を使用）
            const gogyoColors = [
                'var(--wood-color)',  // 木
                'var(--fire-color)',  // 火
                'var(--earth-color)', // 土
                'var(--metal-color)', // 金
                'var(--water-color)'  // 水
            ];
            
            gogyoItems.forEach((item, index) => {
                item.style.backgroundColor = `${gogyoColors[index]}15`; // 透明度15%
                item.style.border = `2px solid ${gogyoColors[index]}`;
                
                // 要素の数に応じてサイズを少し変える
                const count = parseInt(item.querySelector('.gogyo-count').textContent);
                if (count > 0) {
                    const scale = 1 + (count * 0.1); // 数が多いほど大きく
                    item.style.transform = `scale(${scale})`;
                    item.style.zIndex = count; // 重なり順も調整
                }
                
                // 要素の名前の色も設定
                const gogyoName = item.querySelector('.gogyo-name');
                if (gogyoName) {
                    gogyoName.style.color = gogyoColors[index];
                    gogyoName.style.textShadow = '0px 0px 1px rgba(0,0,0,0.2)';
                }
            });
        }
        
        // 陰陽のバランス表示用のスタイル
        const inyoContainer = this.container.querySelector('.inyo-container');
        if (inyoContainer) {
            // CSSで基本スタイルを設定済みなので、ここでは陰陽ごとの色のみ設定
            const inyoItems = inyoContainer.querySelectorAll('.inyo-item');
            
            inyoItems.forEach((item, index) => {
                const color = index === 0 ? 'var(--yang-color)' : 'var(--yin-color)';
                item.style.backgroundColor = `${color}15`; // 透明度15%
                item.style.border = `2px solid ${color}`;
                
                // 要素の数に応じてサイズを少し変える
                const count = parseInt(item.querySelector('.inyo-count').textContent);
                if (count > 0) {
                    const scale = 1 + (count * 0.05); // 数が多いほど大きく（陰陽は控えめに）
                    item.style.transform = `scale(${scale})`;
                }
                
                // 陰陽の名前の色も設定
                const inyoName = item.querySelector('.inyo-name');
                if (inyoName) {
                    inyoName.style.color = color;
                    inyoName.style.textShadow = '0px 0px 1px rgba(0,0,0,0.2)';
                }
                
                // 背景に陰陽のシンボルを薄く表示
                const symbol = index === 0 ? '☯' : '☯';
                item.style.position = 'relative';
                item.style.overflow = 'hidden';
                
                // すでに作成済みのシンボル要素があれば削除
                const existingSymbol = item.querySelector('.inyo-symbol');
                if (existingSymbol) {
                    existingSymbol.remove();
                }
                
                const symbolEl = document.createElement('div');
                symbolEl.className = 'inyo-symbol';
                symbolEl.textContent = symbol;
                symbolEl.style.position = 'absolute';
                symbolEl.style.fontSize = '3rem';
                symbolEl.style.opacity = '0.1';
                symbolEl.style.top = '50%';
                symbolEl.style.left = '50%';
                symbolEl.style.transform = 'translate(-50%, -50%)';
                symbolEl.style.zIndex = '-1';
                item.appendChild(symbolEl);
            });
        }
        
        // 干合、支合、冲、刑のリスト項目にアイコンや色を追加
        const infoSections = this.container.querySelectorAll('.info-section');
        infoSections.forEach(section => {
            const title = section.querySelector('h3').textContent;
            const listItems = section.querySelectorAll('li');
            
            if (listItems.length) {
                // 各項目の前に適切なアイコンを追加
                listItems.forEach(item => {
                    // すでにスタイル適用済みなら処理しない
                    if (item.classList.contains('styled')) return;
                    
                    item.classList.add('styled');
                    
                    if (title.includes('干合')) {
                        item.style.color = 'var(--primary-color)';
                        item.style.borderLeft = '2px solid var(--primary-color)';
                        item.style.paddingLeft = '15px';
                        item.style.marginLeft = '-15px';
                    } else if (title.includes('支合')) {
                        item.style.color = 'var(--accent-color)';
                        item.style.borderLeft = '2px solid var(--accent-color)';
                        item.style.paddingLeft = '15px';
                        item.style.marginLeft = '-15px';
                    } else if (title.includes('冲')) {
                        item.style.color = 'var(--yang-color)';
                        item.style.borderLeft = '2px solid var(--yang-color)';
                        item.style.paddingLeft = '15px';
                        item.style.marginLeft = '-15px';
                    } else if (title.includes('刑')) {
                        item.style.color = 'var(--yin-color)';
                        item.style.borderLeft = '2px solid var(--yin-color)';
                        item.style.paddingLeft = '15px';
                        item.style.marginLeft = '-15px';
                    }
                });
            }
        });
        
        // 命式テーブルの天干・地支に五行の色を適用
        const meishikiTable = this.container.querySelector('.meishiki-table');
        if (meishikiTable) {
            // 天干行（1行目）
            const tenkanCells = meishikiTable.querySelectorAll('tr:nth-child(2) td:not(:first-child)');
            tenkanCells.forEach(cell => {
                const kanText = cell.textContent.split('(')[0].trim();
                if (kanText && kanText !== '-') {
                    const kanIndex = kd.kan.indexOf(kanText);
                    if (kanIndex !== -1) {
                        const gogyoIndex = kd.gogyoKan[kanIndex];
                        const color = [
                            'var(--wood-color)',  // 木
                            'var(--fire-color)',  // 火
                            'var(--earth-color)', // 土
                            'var(--metal-color)', // 金
                            'var(--water-color)'  // 水
                        ][gogyoIndex];
                        
                        cell.style.borderBottom = `3px solid ${color}`;
                        cell.style.fontWeight = '500';
                    }
                }
            });
            
            // 地支行（2行目）
            const chishiCells = meishikiTable.querySelectorAll('tr:nth-child(3) td:not(:first-child)');
            chishiCells.forEach(cell => {
                const shiText = cell.textContent.trim();
                if (shiText && shiText !== '-') {
                    const shiIndex = kd.shi.indexOf(shiText);
                    if (shiIndex !== -1) {
                        const gogyoIndex = kd.gogyoShi[shiIndex];
                        const color = [
                            'var(--wood-color)',  // 木
                            'var(--fire-color)',  // 火
                            'var(--earth-color)', // 土
                            'var(--metal-color)', // 金
                            'var(--water-color)'  // 水
                        ][gogyoIndex];
                        
                        cell.style.borderBottom = `3px solid ${color}`;
                        cell.style.fontWeight = '500';
                    }
                }
            });
        }
    }
    
    /**
     * 結果をクリアする
     */
    clear() {
        this.container.innerHTML = '';
    }
}

export default MeishikiResult; 