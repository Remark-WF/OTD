import React from "react";
import "../styles/style.css";
import { usePageTracking } from "../hooks/usePageTracking";

function MainPanel() {

  usePageTracking(3);

  return (
    <main className="content">
      <h1 id="intro">Контроль качества маркировки на производстве</h1>
      <p>
        Контроль качества маркировки — это важный этап в производственном процессе,
        позволяющий убедиться, что каждая единица продукции имеет правильную и читаемую маркировку.
      </p>

      <h2 id="process" className="hover-head">Процесс контроля</h2>
      <p>
        Специалисты используют автоматизированные системы для сканирования штрих-кодов и проверки соответствия
        стандартам. Это помогает снизить количество брака и повысить доверие клиентов.
      </p>

      <img src="/image.jpg" alt="Производство" className="animated-img" />

      <h2 id="table" className="hover-head">Пример таблицы проверки</h2>
      <table>
        <thead>
          <tr>
            <th>Этап</th>
            <th>Ответственный</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Сканирование</td>
            <td>Оператор</td>
            <td>Готово</td>
          </tr>
          <tr>
            <td>Верификация</td>
            <td>Контролер</td>
            <td>В процессе</td>
          </tr>
          <tr>
            <td>Отчет</td>
            <td>Менеджер</td>
            <td>Ожидание</td>
          </tr>
        </tbody>
      </table>

      <h2 id="list" className="hover-head">Основные преимущества</h2>
      <ul className="custom-list">
        <li>Снижение числа ошибок маркировки</li>
        <li>Повышение скорости выпуска продукции</li>
        <li>Улучшение репутации бренда</li>
      </ul>

      <h3 id="contacts" className="hover-head">Контакты</h3>
      <p>
        По вопросам сотрудничества: <span className="highlight">quality@factory.com</span>
      </p>

      <div className="note">
        Важно: <span className="inline-note">регулярно обновлять оборудование для сканирования</span>.
      </div>
    </main>
  );
}

export default MainPanel;
