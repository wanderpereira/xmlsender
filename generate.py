import random
from datetime import datetime, timedelta

# Data inicial e final
start_date = "01.01.2020"
end_date = "30.03.2020"

# Converte as datas para o formato de data do Python
start_date = datetime.strptime(start_date, "%d.%m.%Y")
end_date = datetime.strptime(end_date, "%d.%m.%Y")

# Data atual
current_date = start_date

# Loop até que a data atual seja igual à data final
while current_date <= end_date:
    # Gera um número randômico de 44 dígitos
    random_number = str(random.randint(1000000000000000000000000000000, 9999999999999999999999999999999))

    # Abre o arquivo para escrita ('w' significa write)
    arquivo = open(current_date.strftime("%d.%m.%Y") + ' - CFe' + random_number + '.xml', 'w')

    # Escreve no arquivo
    arquivo.write('Um arquivo de exemplo')

    # Fecha o arquivo
    arquivo.close()
    
    # Avança para o próximo dia
    current_date += timedelta(days=1)
