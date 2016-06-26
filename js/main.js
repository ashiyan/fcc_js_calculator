// $(document).ready() заменяется на...
document.addEventListener( "DOMContentLoaded", function() {
	
	// Переменные для отображения числа на главном дисплее и результирующего выражения на втором дисплее
	var number_display, expression_display;
	
	// Переменная для хранения типа округления
	var round_type = 100;
	
	// Переменная для хранения последней арифметической операции
	var last_action = "";
	
	// Функция сброса основных переменных
	function reset() { number_display = "0"; expression_display = ""; last_action = ""; };
	
	// Функция удаления последнего символа из числа
	function deleteLast() { number_display = number_display.substring(0, number_display.length - 1); if (number_display.length === 0) number_display = "0"; };
	
	// Функция проверки наличия десятичного разделителя в конце числа
	function isCommaLast() { return /\./.test(number_display[number_display.length - 1]); };
	
	// Функция вывода переменных на дисплеи
	function refresh() {
		document.querySelector(".display-main").value = number_display;
		document.querySelector(".display-result").value = expression_display;
		if (number_display.length > 25) document.querySelector(".display-main").style.fontSize = "100%";
		else if (number_display.length > 14) document.querySelector(".display-main").style.fontSize = "200%";
		else document.querySelector(".display-main").style.fontSize = "350%";
	}
	
	// Функция инициализации ввода пользователя
	function initialize_user_input(event) {
		switch(true) {
		// Верхняя строка цифр
			case (event.keyCode >= 48 && event.keyCode <= 57): return String(event.keyCode - 48);
		// Цифры на NumPad-клавиатуре
			case (event.keyCode >= 96 && event.keyCode <= 105): return String(event.keyCode - 96);
		// Знаки математических операций на обычной и NumPad-клавиатуре
			case (event.keyCode === 106): return "*";
			case (event.keyCode === 109): return "-";
			case (event.keyCode === 107): return "+";
			case (event.keyCode === 111): return "/";
			case (event.keyCode === 110): return ".";
			case (event.keyCode === 13): return "=";
			case (event.keyCode === 8): return "delete";
			case (event.keyCode === 46): return "clear";
			default: return event.target.dataset.meaning;
		}
	}
	
	// Функция, описывающая работу окна настроек округления
	function show_popup() {
		// Отображение окна настроек и подложки
		document.querySelector(".popup-round").style.display = "flex";
		document.querySelector(".black-wrap").style.display = "block";
		
		// Изменение переменной при выборе типа округления и закрытие окна настроек и подложки по нажатию "OK"
		document.querySelector(".popup-round-button").addEventListener("click", function() {
			if (document.querySelector(".popup-round-r2").checked) round_type = 100;
			else if (document.querySelector(".popup-round-r3").checked) round_type = 1000;
			else if (document.querySelector(".popup-round-r4").checked) round_type = 10000;
			
			document.querySelector(".popup-round").style.display = "none";
			document.querySelector(".black-wrap").style.display = "none";
		});
	}
	
	
	// =================== ОСНОВНАЯ ФУНКЦИЯ: Обработка ввода и вывода ===================
	
	
	function calculate(event) {
		
		// Переменная, которая хранит ввод пользователя
		var user_input = initialize_user_input(event);
		
		// Проверяем ввод и вывод
		switch(true) {
				
		// Если при вводе на дисплее была ошибка - очистить дисплей
			case (!/\d/.test(number_display)):
				reset();
				break;
				
		// Если вводится цифра
			case (/\d/.test(user_input)):
				// В случае, если ранее на дисплее был ноль и опять ввели ноль - новые нули не добавлять, чтобы не получилось "0000"
				if (number_display === "0" && user_input === "0") number_display = "0";
				// Если ранее на дисплее был ноль и введена другая цифра - заменить ноль на эту цифру, чтобы не получилось "0123"
				else if (number_display === "0" && user_input != "0") number_display = user_input;
				// Простое добавление цифр
				else number_display += user_input;
				break;
				
		// Если вводится знак операции
			case (/[\+\-\*\/]/.test(user_input)):
				// Если ранее введенное число не заканчивается десятичным разделителем
				if (!isCommaLast()) {
					// Добавляем к результирующему выражению число и знак операции
					expression_display += number_display + user_input;
					// А главный дисплей сбрасываем
					number_display = "0";
				}
				break;
				
		// Если вводится десятичный разделителель, проверяем есть ли он уже у нас в числе. Если нет - добавляем
			case (/\./.test(user_input) && !number_display.match(/\./g)):
				number_display += ".";
				break;

		// Если нажата кнопка удаления символа, запускаем функцию deleteLast();
			case (user_input === "delete"):
				deleteLast();
				break;

		// Если нажата кнопка сброса, запускаем функцию reset();
			case (user_input === "clear"):
				reset();
				break;
				
		// Если нажата кнопка "равно"
			case (user_input === "="):
				// Если ранее введенное число не заканчивается десятичным разделителем
				if (!isCommaLast()) {
					
					// Переменная для математического расчета
					var result = 0;
					
					// Если результирующий дисплей не пустой
					if (expression_display.length > 0) {
						// Сохраняем последнюю введенный знак операции и число
						last_action = expression_display[expression_display.length - 1] + number_display;
						// Добавляем к результирующему выражению число
						expression_display += number_display;
						// Проводим математический расчет всего выражения
						result = eval(expression_display);
					}
					
					// Если результирующий дисплей пустой и все равно нажата клавиша "равно"
					else {
						// Проводим математический расчет между числом на главном дисплее и сохраненной последней операцией
						result = eval(number_display + last_action);
					}
					
					// Если полученный результат - не целое число, оругляем его до нужного количества знаком после запятой
					if ((result - Math.floor(result)) !== 0) result = Math.round(result * round_type) / round_type;
					// Переменной для вывода на главный дисплей присваиваем результат математического выражения, полученного из строки в результирующем дисплее
					number_display = String(result);
					// Сбрасываем результирующий дисплей
					expression_display = "";
				}
				
		}
		
		// Если главный дисплей выдал ошибку "NaN" - изменяем эту ошибку на "Divide by zero"
		if (number_display === "NaN") number_display = "Divide by zero";
		
		// Вывод на дисплей переменных после всех операций над ними
		refresh();
	};
	
	
	// ============================= КОНЕЦ ОСНОВНОЙ ФУНКЦИИ =============================
	
	
	// Сброс переменных на начальные значения при старте программы
	reset();
	
	// Получение nod-листа со всем элементами с классом .btn
	var buttons = document.querySelectorAll(".btn");
	
		
	// Подписка на событие "click" всех элементов в перечне button. Обработчик события: функция "calculate"
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", calculate);
	}
	
	// Обработка события нажатия клавиш клавиатуры. Обработчик тот же, функция "calculate"
	document.addEventListener("keydown", calculate);
	
	// Подписка на событие "click" кнопки ".settings". Обработчик события: функция "show_popup" - вывод окна настроек
	document.querySelector(".settings").addEventListener("click", show_popup);
	
});