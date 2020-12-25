const formatDate = (value: Date): string => Intl.DateTimeFormat('pt-BR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
}).format(value);

export default formatDate;
