exports.resultTemplate = `<html><head>
<style>
  .show {
    display: block !important;
  }
</style>
<script>
  function toggle(id) {
    document.getElementById(id).classList.toggle('show');
  }
</script>
</head><body style="font-family:Arial;padding:20px;">
<h1>Results for <%=url %></h1>
<p>Total violations for this webpage: <%=results.violations.length %></p>

<h2>Violation Details</h2>
<% results.violations.forEach(function(violation, index){ %>
    <div style="border:1px solid grey;
    padding:15px;
    border-radius:5px;margin-bottom:15px;">
      <h3><%=index+1 %>. <%=violation.description%></h3>
      <h4>Severity: <span style="color:<%=violation.impact == 'minor' ? 'green': 'red'%>;" ><%=violation.impact %></span></h4>
      <h5>Tags: 
        <% violation.tags.forEach(function(tag){ %>
          <span style="margin-right:10px"><%=tag%></span>
        <% }); %> 
      </h5>
      <ol type="a">
        <% violation.nodes.forEach(function(node, idx){ %>
          <li><p><%=node.failureSummary %></p>
            <button id="btn-<%=index%>-<%=idx %>" type="button" onClick="toggle('code-<%=index%>-<%=idx %>')">Show Target Markup</button>
            <pre id="code-<%=index%>-<%=idx %>" style="display:none;white-space:break-spaces;overflow-x:auto;"><%=node.html %></pre>
          </li>
        <% }); %>
      </ol>
    </div>
<% }); %>

</body></html>`;