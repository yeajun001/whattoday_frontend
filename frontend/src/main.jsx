import { useNavigate } from 'react-router-dom';
import styles from './main.module.css';

function Main() {
    const navigate = useNavigate()

    const googlelogincheck = sessionStorage.getItem('googlelogincheck')
    const githublogincheck = sessionStorage.getItem('githublogincheck')
    
    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']} onClick={() => navigate("/")}><div className={styles['head-text-img']}></div><div className={styles.click}>오늘 뭐해?</div></div>
                    <div className={styles['header-right-text-box']}>
                        <div className={styles['header-right-text']} onClick={googlelogincheck == null && githublogincheck == null ? () => navigate("/loginmain") : () => navigate("/mainlin") }><div className={styles.click}>로그인</div></div>
                    </div>
                </div>
            </header>
            <section className={styles.all}>
                <div className={styles.main}>
                    <div className={styles['main-text']}>
                        <div className={styles['main-text-ani']}>어서오세요!</div>
                        <div className={styles['main-text-ani']}>저희 사이트에서 여러분들만의 캘린더를 만들어보세요!</div>
                        <div className={styles['cal-button']}>
                            <div className={styles['cal-text']} onClick={googlelogincheck == null && githublogincheck == null ? () => navigate("/loginmain") : () => navigate("/cal")}>
                                <div><div className={styles.click}>캘린더로 이동</div></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles["main-icon"]}>
                        <div className={styles["img-icon"]}></div>
                    </div>
                </div>
            </section>
            <section className={styles.all}>
                <div className={styles["sub-main"]}>
                    <ul className={styles["sc-list"]}>
                        <li className={styles["li-cal"]} onClick={googlelogincheck == null && githublogincheck == null ? () => navigate("/loginmain") : () => navigate("/cal")}>
                            <div className={styles["li-cal-text-box"]}>
                                <div className={styles["li-cal-title"]}>
                                    캘린더
                                </div>
                                <div className={styles["li-cal-text"]}>
                                    학사 일정을 알려주고 원하는 날짜에 문구를 남기고 사진을 넣을 수 있습니다.
                                </div>
                            </div>
                        </li>
                        <li className={styles["li-class"]}>
                            <div className={styles["li-class-text-box"]}>
                                <div className={styles["li-class-title"]}>
                                    시간표
                                </div>
                                <div className={styles["li-class-text"]}>
                                    우리 반 시간표를 보여주고 그 날의 시간표를 왼쪽에 보여줍니다.
                                </div>
                            </div>
                        </li>
                        <li className={styles["li-eat"]}>
                            <div className={styles["li-eat-text-box"]}>
                                <div className={styles["li-eat-title"]}>
                                    급식표
                                </div>
                                <div className={styles["li-eat-text"]}>
                                    오늘의 급식을 보여주고 식단과 칼로리를 보여줍니다.
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section className={styles.all}>
                <div className={styles["sub2-main"]}>
                </div>
            </section>
            <footer>
                <div className={styles["footer-main"]}>
                    <div className={styles["footer-text"]}>
                        <p>copyright all rights reserved.</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}

export default Main;
