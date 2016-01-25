#include <stdio.h>
#include <stdlib.h>

#ifdef _WIN32
#define CLEAR_SCREEN "cls"
#define PAUSE "pause"
#endif

#ifdef __unix__
#define CLEAR_SCREEN "clear"
#define PAUSE "read"
#endif

char board[3][3] = { { ' ', ' ', ' ' },{ ' ', ' ', ' ' },{ ' ', ' ', ' ' } };
char player = 'X';

int update(void)
{
	int i, j, played = 0;
	char c;

	scanf(" %c", &c);
	switch (c)
	{
	case '1': i = 0; j = 0; break;
	case '2': i = 0; j = 1; break;
	case '3': i = 0; j = 2; break;
	case '4': i = 1; j = 0; break;
	case '5': i = 1; j = 1; break;
	case '6': i = 1; j = 2; break;
	case '7': i = 2; j = 0; break;
	case '8': i = 2; j = 1; break;
	case '9': i = 2; j = 2; break;
	default: break;
	}

	if (board[i][j] == ' ')
	{
		board[i][j] = player; 
		played = 1;
	}

	return played;
}

void change_player()
{
	if (player == 'X')
		player = 'O';
	else
		player = 'X';
}

void draw(void)
{
	system(CLEAR_SCREEN);
	printf("\n  |-------|                        |-------|\n");
	printf("  |       |                        |       |\n");
	printf("  | %c %c %c |                        | 7 8 9 |\n", board[2][0], board[2][1], board[2][2]);
	printf("  | %c %c %c |    Playing now: %c      | 4 5 6 |\n", board[1][0], board[1][1], board[1][2], player);
	printf("  | %c %c %c |                        | 1 2 3 |\n", board[0][0], board[0][1], board[0][2]);
	printf("  |       |                        |       |\n");
	printf("  |-------|                        |-------|\n\n");
}

int check(void)
{
	char p[2] = { 'X', 'O' };
	for (int i = 0; i < 2; i++)
		if ((board[0][0] == p[i] && board[0][1] == p[i] && board[0][2] == p[i]) ||
			(board[1][0] == p[i] && board[1][1] == p[i] && board[1][2] == p[i]) ||
			(board[2][0] == p[i] && board[2][1] == p[i] && board[2][2] == p[i]) ||
			(board[2][0] == p[i] && board[1][0] == p[i] && board[0][0] == p[i]) ||
			(board[2][1] == p[i] && board[1][1] == p[i] && board[0][1] == p[i]) ||
			(board[2][2] == p[i] && board[1][2] == p[i] && board[0][2] == p[i]) ||
			(board[2][0] == p[i] && board[1][1] == p[i] && board[0][2] == p[i]) ||
			(board[0][0] == p[i] && board[1][1] == p[i] && board[2][2] == p[i]))
		{
			player = p[i];
			return 1;
		}
	for (int i = 0; i < 3; i++)
		for (int j = 0; j < 3; j++)
			if (board[i][j] == ' ')
				return 0;
	return 2;
}

int main(void)
{
	int x;
	printf("TicTacToe!\n\n");
	system(PAUSE);
	while (1)
	{
		draw();

		if (update())
			change_player();

		x = check();
		if (x == 1 || x == 2)
		{
			system(CLEAR_SCREEN);
			if (x == 1)
				printf("%c won!\n\n", player);
			if (x == 2)
				printf("Draw\n\n");
			break;
		}
	}
	system(PAUSE);
}