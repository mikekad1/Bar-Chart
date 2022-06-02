fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(res => res.json()).
then(res => {
  const { data } = res;

  visualizingData(data.map(d => [d[0], d[1]]));
});

function visualizingData(data) {
  const w = 800;
  const h = 400;
  const padding = 40;
  const tooltip = document.getElementById('tooltip');
  const barWidth = w / data.length;

  const yScale = d3.scaleLinear().
  domain([0, d3.max(data, d => d[1])]).
  range([h - padding, padding]);

  const xScale = d3.scaleTime().
  domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))]).
  range([padding, w - padding]);

  const svg = d3.select('#container').append('svg').
  attr('width', w).
  attr('height', h);

  svg.selectAll('rect').
  data(data).
  enter().
  append('rect').
  attr('class', 'bar').
  attr('fill', '#78e08f').
  attr('data-date', d => d[0]).
  attr('data-gdp', d => d[1]).
  attr('x', d => xScale(new Date(d[0]))).
  attr('y', d => yScale(d[1])).
  attr('width', barWidth).
  attr('height', d => h - yScale(d[1]) - padding).
  on('mouseover', (d, i) => {

    tooltip.classList.add('show');
    tooltip.style.left = i * barWidth + padding * 2 + 'px';
    tooltip.style.top = h - padding * 4 + 'px';
    tooltip.setAttribute('data-date', d[0]);

    tooltip.innerHTML = `
              <small>${d[0]}</small>
              $${d[1]} Billion
            `;

  }).
  on('mouseout', () => {
    tooltip.classList.remove('show');
  });

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0, ' + (h - padding) + ')').
  call(xAxis);

  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate( ' + padding + ',0)').
  call(yAxis);
}