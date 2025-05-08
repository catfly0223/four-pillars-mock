/**
 * 生年月日と性別を入力するフォームコンポーネント
 */
export class BirthdayForm {
    constructor(container, onSubmit) {
        this.container = container;
        this.onSubmit = onSubmit;
        this.render();
        this.setupEventListeners();
    }
    
    /**
     * フォームをレンダリングする
     */
    render() {
        const currentDate = new Date().toISOString().split('T')[0];
        
        this.container.innerHTML = `
            <h2>命式計算の基本情報</h2>
            <p class="form-description">運命を読み解くために、生年月日と性別をご入力ください</p>
            <form id="birthday-form">
                <div class="form-group">
                    <label for="birthday-date">生年月日</label>
                    <input type="date" id="birthday-date" max="${currentDate}" required>
                </div>
                
                <div class="form-group">
                    <label for="birthday-time">生まれた時間（わかる場合）</label>
                    <input type="time" id="birthday-time">
                    <small class="form-hint">時間がわからない場合は空欄のままで結構です</small>
                </div>
                
                <div class="form-group">
                    <label for="sex">性別</label>
                    <select id="sex" required>
                        <option value="0">男性</option>
                        <option value="1">女性</option>
                    </select>
                </div>
                
                <div class="button-container">
                    <button type="submit">命式を計算する</button>
                </div>
            </form>
        `;
        
        // フォーム説明文のスタイル
        const formDescription = this.container.querySelector('.form-description');
        if (formDescription) {
            formDescription.style.marginBottom = '25px';
            formDescription.style.color = 'var(--text-color)';
            formDescription.style.fontStyle = 'italic';
            formDescription.style.textAlign = 'center';
        }
        
        // ヒントテキストのスタイル
        const formHint = this.container.querySelector('.form-hint');
        if (formHint) {
            formHint.style.display = 'block';
            formHint.style.marginTop = '5px';
            formHint.style.fontSize = '0.85rem';
            formHint.style.color = 'var(--secondary-color)';
        }
    }
    
    /**
     * イベントリスナーをセットアップする
     */
    setupEventListeners() {
        const form = document.getElementById('birthday-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const date = document.getElementById('birthday-date').value;
            const time = document.getElementById('birthday-time').value;
            const sex = parseInt(document.getElementById('sex').value);
            
            // 日付と時間を結合
            const birthday = time ? `${date}T${time}` : date;
            
            // コールバック関数を呼び出す
            this.onSubmit({
                birthday,
                sex
            });
        });
    }
}

export default BirthdayForm; 