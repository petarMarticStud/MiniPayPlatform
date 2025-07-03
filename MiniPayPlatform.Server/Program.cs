using MiniPayPlatform.Server.Repositories;
using MiniPayPlatform.Server.Services;

var builder = WebApplication.CreateBuilder(args);

//HTTP CLient
builder.Services.AddHttpClient(); 

// Add services to the container.
builder.Services.AddScoped<IPaymentProviderRepository, JsonPaymentProviderRepository>();
builder.Services.AddScoped<IPaymentProviderService, PaymentProviderService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ITransactionRepository, JsonTransactionRepository>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
