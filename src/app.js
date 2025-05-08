/**
 * 四柱推命アプリのメインエントリーポイント
 */
import { BirthdayForm } from './components/BirthdayForm.js';
import { MeishikiResult } from './components/MeishikiResult.js';
import { calculateMeishiki } from './utils/meishikiCalculator.js';

class FourPillarsApp {
    constructor() {
        // 入力コンテナと結果コンテナの要素を取得
        this.inputContainer = document.getElementById('input-container');
        this.resultContainer = document.getElementById('result-container');
        
        // コンポーネントのインスタンスを作成
        this.birthdayForm = new BirthdayForm(this.inputContainer, this.handleFormSubmit.bind(this));
        this.meishikiResult = new MeishikiResult(this.resultContainer);
        
        // フォームデータを保持する変数
        this.formData = null;
        
        // メッセージ要素を作成
        this.createMessageElement();
    }
    
    /**
     * メッセージ表示用の要素を作成
     */
    createMessageElement() {
        this.messageElement = document.createElement('div');
        this.messageElement.id = 'message';
        this.messageElement.style.padding = '10px';
        this.messageElement.style.marginTop = '10px';
        this.messageElement.style.borderRadius = '4px';
        this.messageElement.style.display = 'none';
        
        this.resultContainer.appendChild(this.messageElement);
    }
    
    /**
     * フォーム送信時の処理
     * @param {Object} formData フォームデータ
     */
    handleFormSubmit(formData) {
        try {
            // フォームデータを保存
            this.formData = formData;
            
            // 結果をクリア
            this.meishikiResult.clear();
            
            // 命式を計算
            const meishiki = calculateMeishiki(formData.birthday, formData.sex);
            
            // 結果を表示
            this.meishikiResult.render(meishiki, formData);
            
            // スクロール
            this.resultContainer.scrollIntoView({ behavior: 'smooth' });
            
            // 成功メッセージを表示
            this.showMessage('命式の計算が完了しました。', 'success');
        } catch (error) {
            console.error('命式の計算中にエラーが発生しました:', error);
            this.showMessage('エラーが発生しました: ' + error.message, 'error');
        }
    }
    
    /**
     * メッセージを表示する
     * @param {String} message メッセージ
     * @param {String} type メッセージタイプ（'success' または 'error'）
     */
    showMessage(message, type) {
        this.messageElement.textContent = message;
        this.messageElement.style.display = 'block';
        
        if (type === 'success') {
            this.messageElement.style.backgroundColor = 'rgba(42, 157, 143, 0.2)';
            this.messageElement.style.color = 'var(--success-color)';
            this.messageElement.style.border = '1px solid var(--success-color)';
        } else {
            this.messageElement.style.backgroundColor = 'rgba(230, 57, 70, 0.2)';
            this.messageElement.style.color = 'var(--error-color)';
            this.messageElement.style.border = '1px solid var(--error-color)';
        }
        
        // 5秒後に非表示にする
        setTimeout(() => {
            this.messageElement.style.display = 'none';
        }, 5000);
    }
}

// DOMの読み込みが完了したらアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new FourPillarsApp();
}); 